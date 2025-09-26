/**
 * Doma Poll API Service
 * Handles real-time event polling from Doma Protocol
 * Based on: https://docs.doma.xyz/api-reference/poll-api
 */

import config from './config.js';

class DomaPollService {
  constructor() {
    this.isPolling = false;
    this.pollingInterval = null;
    this.lastEventId = null;
    this.eventHandlers = new Map();
    this.errorHandlers = new Set();
  }

  /**
   * Start polling for events
   * @param {number} lastEventId - Starting event ID (optional)
   * @param {Object} options - Polling options
   * @param {string[]} options.eventTypes - Event types to poll for (defaults to ['NAME_CLAIMED', 'NAME_TOKENIZED'])
   */
  async startPolling(lastEventId = null, options = {}) {
    if (this.isPolling) {
      console.warn('Polling is already active');
      return;
    }

    this.isPolling = true;
    this.lastEventId = lastEventId;

    const pollOptions = {
      interval: options.interval || config.polling.interval,
      limit: options.limit || config.polling.batchSize,
      eventTypes: options.eventTypes || ['NAME_CLAIMED', 'NAME_TOKENIZED'],
      finalizedOnly: options.finalizedOnly !== false, // Default to true
    };

    console.log('Starting Doma Poll API polling...', pollOptions);

    // Start polling loop
    this.pollingInterval = setInterval(async () => {
      try {
        await this.pollEvents(pollOptions);
      } catch (error) {
        console.error('Polling error:', error);
        this.handleError(error);
      }
    }, pollOptions.interval);
  }

  /**
   * Stop polling for events
   */
  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
    this.isPolling = false;
    console.log('Stopped Doma Poll API polling');
  }

  /**
   * Poll for new events
   * @param {Object} options - Polling options
   */
  async pollEvents(options) {
    const url = new URL(config.endpoints.poll);
    
    // Add query parameters according to API spec
    if (options.eventTypes && options.eventTypes.length > 0) {
      options.eventTypes.forEach(eventType => {
        url.searchParams.append('eventTypes', eventType);
      });
    }
    
    if (options.limit) {
      url.searchParams.append('limit', options.limit);
    }
    
    if (options.finalizedOnly !== undefined) {
      url.searchParams.append('finalizedOnly', options.finalizedOnly);
    }

    const response = await this.makeRequest(url.toString(), {
      method: 'GET',
      headers: this.getHeaders(),
    });

    if (response.events && response.events.length > 0) {
      console.log(`Received ${response.events.length} events from Doma Poll API`);
      
      // Process each event
      for (const event of response.events) {
        await this.processEvent(event);
      }

      // Acknowledge the last event to update our cursor
      if (response.lastId) {
        await this.acknowledgeEvents(response.lastId);
        this.lastEventId = response.lastId;
      }
    }

    return response;
  }

  /**
   * Process a single event
   * @param {Object} event - Event data
   */
  async processEvent(event) {
    // console.log('Processing event:', event.type, event);

    // Notify event handlers
    const handlers = this.eventHandlers.get(event.type) || [];
    for (const handler of handlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error(`Error in event handler for ${event.type}:`, error);
      }
    }

    // Notify general event handlers
    const generalHandlers = this.eventHandlers.get('*') || [];
    for (const handler of generalHandlers) {
      try {
        await handler(event);
      } catch (error) {
        console.error('Error in general event handler:', error);
      }
    }
  }

  /**
   * Acknowledge received events
   * @param {number} lastEventId - Last event ID that was processed
   */
  async acknowledgeEvents(lastEventId) {
    try {
      const url = `${config.endpoints.poll}/ack/${lastEventId}`;
      
      await this.makeRequest(url, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      
      console.log(`Acknowledged events up to ID: ${lastEventId}`);
    } catch (error) {
      console.error('Failed to acknowledge events:', error);
      throw error;
    }
  }

  /**
   * Reset polling cursor to a specific event ID
   * @param {number} eventId - Event ID to reset to (0 to reset to beginning)
   */
  async resetPollingCursor(eventId = 0) {
    try {
      const url = `${config.endpoints.poll}/reset/${eventId}`;
      
      await this.makeRequest(url, {
        method: 'POST',
        headers: this.getHeaders(),
      });
      
      this.lastEventId = eventId;
      console.log(`Reset polling cursor to event ID: ${eventId}`);
    } catch (error) {
      console.error('Failed to reset polling cursor:', error);
      throw error;
    }
  }

  /**
   * Register an event handler
   * @param {string} eventType - Event type to listen for ('*' for all events)
   * @param {Function} handler - Event handler function
   */
  onEvent(eventType, handler) {
    if (!this.eventHandlers.has(eventType)) {
      this.eventHandlers.set(eventType, []);
    }
    this.eventHandlers.get(eventType).push(handler);
  }

  /**
   * Unregister an event handler
   * @param {string} eventType - Event type
   * @param {Function} handler - Event handler function
   */
  offEvent(eventType, handler) {
    if (this.eventHandlers.has(eventType)) {
      const handlers = this.eventHandlers.get(eventType);
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  /**
   * Register an error handler
   * @param {Function} handler - Error handler function
   */
  onError(handler) {
    this.errorHandlers.add(handler);
  }

  /**
   * Unregister an error handler
   * @param {Function} handler - Error handler function
   */
  offError(handler) {
    this.errorHandlers.delete(handler);
  }

  /**
   * Handle errors
   * @param {Error} error - Error object
   */
  handleError(error) {
    for (const handler of this.errorHandlers) {
      try {
        handler(error);
      } catch (handlerError) {
        console.error('Error in error handler:', handlerError);
      }
    }
  }

  /**
   * Make HTTP request with retry logic
   * @param {string} url - Request URL
   * @param {Object} options - Request options
   */
  async makeRequest(url, options = {}) {
    let lastError;
    
    for (let attempt = 1; attempt <= config.api.retryAttempts; attempt++) {
      try {
        const response = await fetch(url, {
          ...options,
          timeout: config.api.timeout,
        });

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        return await response.json();
      } catch (error) {
        lastError = error;
        console.warn(`Request attempt ${attempt} failed:`, error.message);
        
        if (attempt < config.api.retryAttempts) {
          await new Promise(resolve => 
            setTimeout(resolve, config.api.retryDelay * attempt)
          );
        }
      }
    }

    throw lastError;
  }

  /**
   * Get request headers
   */
  getHeaders() {
    const headers = {
      'Accept': '*/*',
    };

    if (config.api.key) {
      headers['Api-Key'] = config.api.key;
    }

    return headers;
  }

  /**
   * Get current polling status
   */
  getStatus() {
    return {
      isPolling: this.isPolling,
      lastEventId: this.lastEventId,
      eventHandlerCount: this.eventHandlers.size,
      errorHandlerCount: this.errorHandlers.size,
    };
  }
}

// Create singleton instance
const domaPollService = new DomaPollService();

export default domaPollService;
