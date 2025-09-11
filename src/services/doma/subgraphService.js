/**
 * Doma Subgraph Service
 * Handles GraphQL queries to Doma Protocol subgraph
 * Based on actual schema from https://api-testnet.doma.xyz/graphql
 */

import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { HttpLink } from '@apollo/client/link/http';
import config from './config.js';

class DomaSubgraphService {
  constructor() {
    this.client = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Apollo Client
   */
  async initialize() {
    try {
      const httpLink = new HttpLink({
        uri: config.endpoints.subgraph,
        headers: {
          'Api-Key': config.api.key || '',
        },
      });

      this.client = new ApolloClient({
        link: httpLink,
        cache: new InMemoryCache({
          typePolicies: {
            NameModel: {
              keyFields: ['name'],
            },
            NameListingModel: {
              keyFields: ['id'],
            },
            NameOfferModel: {
              keyFields: ['id'],
            },
            TokenModel: {
              keyFields: ['id'],
            },
            PaginatedNamesResponse: {
              keyFields: false,
            },
            PaginatedNameListingsResponse: {
              keyFields: false,
            },
            PaginatedNameOffersResponse: {
              keyFields: false,
            },
          },
        }),
        defaultOptions: {
          watchQuery: {
            errorPolicy: 'all',
          },
          query: {
            errorPolicy: 'all',
          },
        },
      });

      this.isInitialized = true;
      console.log('Doma Subgraph service initialized successfully');
    } catch (error) {
      console.error('Failed to initialize Doma Subgraph service:', error);
      throw error;
    }
  }

  /**
   * Get domain listings with filters
   * @param {Object} filters - Filter options
   */
  async getDomainListings(filters = {}) {
    this.ensureInitialized();

    const query = gql`
      query GetDomainListings(
        $skip: Int
        $take: Int
        $tlds: [String!]
        $createdSince: DateTime
        $sld: String
        $networkIds: [String!]
        $registrarIanaIds: [Int!]
      ) {
        listings(
          skip: $skip
          take: $take
          tlds: $tlds
          createdSince: $createdSince
          sld: $sld
          networkIds: $networkIds
          registrarIanaIds: $registrarIanaIds
        ) {
          items {
            id
            externalId
            price
            offererAddress
            orderbook
            currency {
              address
              symbol
              name
              decimals
            }
            expiresAt
            createdAt
            updatedAt
            name
            nameExpiresAt
            registrar {
              ianaId
              name
              url
            }
            tokenId
            tokenAddress
            chain {
              chainId
              name
              rpcUrl
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
          hasPreviousPage
          hasNextPage
        }
      }
    `;

    const variables = {
      skip: filters.skip || 0,
      take: filters.take || 50,
      tlds: filters.tlds || null,
      createdSince: filters.createdSince || null,
      sld: filters.sld || null,
      networkIds: filters.networkIds || null,
      registrarIanaIds: filters.registrarIanaIds || null,
    };

    try {
      const result = await this.client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });

      return result.data.listings;
    } catch (error) {
      console.error('Failed to fetch domain listings:', error);
      throw error;
    }
  }

  /**
   * Get domain offers
   * @param {Object} filters - Filter options
   */
  async getDomainOffers(filters = {}) {
    this.ensureInitialized();

    const query = gql`
      query GetDomainOffers(
        $skip: Int
        $take: Int
        $sortOrder: SortOrderType
        $tokenId: String
        $offeredBy: [AddressCAIP10!]
        $status: OfferStatus
      ) {
        offers(
          skip: $skip
          take: $take
          sortOrder: $sortOrder
          tokenId: $tokenId
          offeredBy: $offeredBy
          status: $status
        ) {
          items {
            id
            externalId
            price
            offererAddress
            orderbook
            currency {
              address
              symbol
              name
              decimals
            }
            expiresAt
            createdAt
            name
            nameExpiresAt
            registrar {
              ianaId
              name
              url
            }
            tokenId
            tokenAddress
            chain {
              chainId
              name
              rpcUrl
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
          hasPreviousPage
          hasNextPage
        }
      }
    `;

    const variables = {
      skip: filters.skip || 0,
      take: filters.take || 50,
      sortOrder: filters.sortOrder || 'DESC',
      tokenId: filters.tokenId || null,
      offeredBy: filters.offeredBy || null,
      status: filters.status || null,
    };

    try {
      const result = await this.client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });

      return result.data.offers;
    } catch (error) {
      console.error('Failed to fetch domain offers:', error);
      throw error;
    }
  }

  /**
   * Get domain details
   * @param {string} domainName - Domain name
   */
  async getDomainDetails(domainName) {
    this.ensureInitialized();

    const query = gql`
      query GetDomainDetails($name: String!) {
        name(name: $name) {
          name
          expiresAt
          tokenizedAt
          eoi
          registrar {
            ianaId
            name
            url
          }
          nameservers {
            name
            ipv4
            ipv6
          }
          dsKeys {
            keyTag
            algorithm
            digestType
            digest
          }
          transferLock
          claimedBy
          tokens {
            id
            tokenId
            tokenAddress
            owner
            chain {
              chainId
              name
              rpcUrl
            }
          }
          activities {
            ... on NameClaimedActivity {
              type
              txHash
              sld
              tld
              createdAt
              claimedBy
            }
            ... on NameRenewedActivity {
              type
              txHash
              sld
              tld
              createdAt
              expiresAt
            }
            ... on NameDetokenizedActivity {
              type
              txHash
              sld
              tld
              createdAt
              networkId
            }
            ... on NameTokenizedActivity {
              type
              txHash
              sld
              tld
              createdAt
              networkId
            }
            ... on NameClaimRequestedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
            ... on NameClaimApprovedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
            ... on NameClaimRejectedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
          }
          isFractionalized
          fractionalTokenInfo {
            id
            address
            fractionalizedAt
            fractionalizedBy
            boughtOutAt
            boughtOutBy
            buyoutPrice
            status
            poolAddress
            launchpadAddress
            vestingWalletAddress
            chain {
              chainId
              name
              rpcUrl
            }
            params {
              initialValuation
              name
              symbol
              decimals
              totalSupply
              launchpadType
              launchpadSupply
              launchpadFeeBps
              poolSupply
              poolFeeBps
              initialLaunchpadPrice
              finalLaunchpadPrice
              launchStartDate
              launchEndDate
              launchpadData
              vestingCliffSeconds
              vestingDurationSeconds
              initialPoolPrice
              tokenId
              expiresAt
            }
            fractionalizedTxHash
            boughtOutTxHash
            name
          }
        }
      }
    `;

    try {
      const result = await this.client.query({
        query,
        variables: { name: domainName },
        fetchPolicy: 'cache-first',
      });

      return result.data.name;
    } catch (error) {
      console.error('Failed to fetch domain details:', error);
      throw error;
    }
  }

  /**
   * Search domains using the names query
   * @param {Object} filters - Search filters
   */
  async searchDomains(filters = {}) {
    this.ensureInitialized();

    const query = gql`
      query SearchDomains(
        $skip: Int
        $take: Int
        $sortOrder: SortOrderType
        $ownedBy: [AddressCAIP10!]
        $claimStatus: NamesQueryClaimStatus
        $name: String
        $networkIds: [String!]
        $registrarIanaIds: [Int!]
        $tlds: [String!]
        $sortBy: NamesQuerySortBy
        $fractionalized: Boolean
        $listed: Boolean
        $active: Boolean
        $priceRangeMin: Float
        $priceRangeMax: Float
        $priceRangeCurrency: String
      ) {
        names(
          skip: $skip
          take: $take
          sortOrder: $sortOrder
          ownedBy: $ownedBy
          claimStatus: $claimStatus
          name: $name
          networkIds: $networkIds
          registrarIanaIds: $registrarIanaIds
          tlds: $tlds
          sortBy: $sortBy
          fractionalized: $fractionalized
          listed: $listed
          active: $active
          priceRangeMin: $priceRangeMin
          priceRangeMax: $priceRangeMax
          priceRangeCurrency: $priceRangeCurrency
        ) {
          items {
            name
            expiresAt
            tokenizedAt
            eoi
            registrar {
              ianaId
              name
              url
            }
            nameservers {
              name
              ipv4
              ipv6
            }
            dsKeys {
              keyTag
              algorithm
              digestType
              digest
            }
            transferLock
            claimedBy
            tokens {
              id
              tokenId
              tokenAddress
              owner
              chain {
                chainId
                name
                rpcUrl
              }
            }
            isFractionalized
            fractionalTokenInfo {
              id
              address
              status
              chain {
                chainId
                name
                rpcUrl
              }
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
          hasPreviousPage
          hasNextPage
        }
      }
    `;

    const variables = {
      skip: filters.skip || 0,
      take: filters.take || 20,
      sortOrder: filters.sortOrder || 'DESC',
      ownedBy: filters.ownedBy || null,
      claimStatus: filters.claimStatus || 'ALL',
      name: filters.name || null,
      networkIds: filters.networkIds || null,
      registrarIanaIds: filters.registrarIanaIds || null,
      tlds: filters.tlds || null,
      sortBy: filters.sortBy || null,
      fractionalized: filters.fractionalized || null,
      listed: filters.listed || null,
      active: filters.active || null,
      priceRangeMin: filters.priceRangeMin || null,
      priceRangeMax: filters.priceRangeMax || null,
      priceRangeCurrency: filters.priceRangeCurrency || null,
    };

    try {
      const result = await this.client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });

      return result.data.names;
    } catch (error) {
      console.error('Failed to search domains:', error);
      throw error;
    }
  }

  /**
   * Get user's domains
   * @param {string} userAddress - User wallet address
   * @param {Object} options - Query options
   */
  async getUserDomains(userAddress, options = {}) {
    this.ensureInitialized();

    const query = gql`
      query GetUserDomains(
        $skip: Int
        $take: Int
        $sortOrder: SortOrderType
        $ownedBy: [AddressCAIP10!]
        $claimStatus: NamesQueryClaimStatus
        $sortBy: NamesQuerySortBy
      ) {
        names(
          skip: $skip
          take: $take
          sortOrder: $sortOrder
          ownedBy: $ownedBy
          claimStatus: $claimStatus
          sortBy: $sortBy
        ) {
          items {
            name
            expiresAt
            tokenizedAt
            eoi
            registrar {
              ianaId
              name
              url
            }
            nameservers {
              name
              ipv4
              ipv6
            }
            dsKeys {
              keyTag
              algorithm
              digestType
              digest
            }
            transferLock
            claimedBy
            tokens {
              id
              tokenId
              tokenAddress
              owner
              chain {
                chainId
                name
                rpcUrl
              }
            }
            isFractionalized
            fractionalTokenInfo {
              id
              address
              status
              chain {
                chainId
                name
                rpcUrl
              }
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
          hasPreviousPage
          hasNextPage
        }
      }
    `;

    const variables = {
      skip: options.skip || 0,
      take: options.take || 100,
      sortOrder: options.sortOrder || 'DESC',
      ownedBy: [userAddress],
      claimStatus: options.claimStatus || 'ALL',
      sortBy: options.sortBy || null,
    };

    try {
      const result = await this.client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });

      return result.data.names;
    } catch (error) {
      console.error('Failed to fetch user domains:', error);
      throw error;
    }
  }

  /**
   * Get name activities
   * @param {string} domainName - Domain name
   * @param {Object} options - Query options
   */
  async getNameActivities(domainName, options = {}) {
    this.ensureInitialized();

    const query = gql`
      query GetNameActivities(
        $skip: Int
        $take: Int
        $sortOrder: SortOrderType
        $name: String!
        $type: NameActivityType
      ) {
        nameActivities(
          skip: $skip
          take: $take
          sortOrder: $sortOrder
          name: $name
          type: $type
        ) {
          items {
            ... on NameClaimedActivity {
              type
              txHash
              sld
              tld
              createdAt
              claimedBy
            }
            ... on NameRenewedActivity {
              type
              txHash
              sld
              tld
              createdAt
              expiresAt
            }
            ... on NameDetokenizedActivity {
              type
              txHash
              sld
              tld
              createdAt
              networkId
            }
            ... on NameTokenizedActivity {
              type
              txHash
              sld
              tld
              createdAt
              networkId
            }
            ... on NameClaimRequestedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
            ... on NameClaimApprovedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
            ... on NameClaimRejectedActivity {
              type
              txHash
              sld
              tld
              createdAt
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
          hasPreviousPage
          hasNextPage
        }
      }
    `;

    const variables = {
      skip: options.skip || 0,
      take: options.take || 50,
      sortOrder: options.sortOrder || 'DESC',
      name: domainName,
      type: options.type || null,
    };

    try {
      const result = await this.client.query({
        query,
        variables,
        fetchPolicy: 'cache-first',
      });

      return result.data.nameActivities;
    } catch (error) {
      console.error('Failed to fetch name activities:', error);
      throw error;
    }
  }

  /**
   * Get name statistics
   * @param {string} tokenId - Token ID
   */
  async getNameStatistics(tokenId) {
    this.ensureInitialized();

    const query = gql`
      query GetNameStatistics($tokenId: String!) {
        nameStatistics(tokenId: $tokenId) {
          name
          highestOffer {
            id
            externalId
            price
            offererAddress
            orderbook
            currency {
              address
              symbol
              name
              decimals
            }
            expiresAt
            createdAt
            name
            nameExpiresAt
            registrar {
              ianaId
              name
              url
            }
            tokenId
            tokenAddress
            chain {
              chainId
              name
              rpcUrl
            }
          }
          activeOffers
          offersLast3Days
        }
      }
    `;

    try {
      const result = await this.client.query({
        query,
        variables: { tokenId },
        fetchPolicy: 'cache-first',
      });

      return result.data.nameStatistics;
    } catch (error) {
      console.error('Failed to fetch name statistics:', error);
      throw error;
    }
  }

  /**
   * Get chain statistics
   */
  async getChainStatistics() {
    this.ensureInitialized();

    const query = gql`
      query GetChainStatistics {
        chainStatistics {
          totalNames
          totalTokens
          totalListings
          totalOffers
          totalVolume
          totalRevenue
        }
      }
    `;

    try {
      const result = await this.client.query({
        query,
        fetchPolicy: 'cache-first',
      });

      return result.data.chainStatistics;
    } catch (error) {
      console.error('Failed to fetch chain statistics:', error);
      throw error;
    }
  }

  /**
   * Ensure service is initialized
   */
  ensureInitialized() {
    if (!this.isInitialized || !this.client) {
      throw new Error('Doma Subgraph service not initialized. Call initialize() first.');
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      endpoint: config.endpoints.subgraph,
    };
  }
}

// Create singleton instance
const domaSubgraphService = new DomaSubgraphService();

export default domaSubgraphService;
