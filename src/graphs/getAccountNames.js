export const getNamesOwnedByAddress = async (address) => {
    const url = "https://api-testnet.doma.xyz/graphql"; // Doma multi-chain subgraph endpoint
    const ownerCAIP10 = `eip155:1:${address.toLowerCase()}`; // format address as CAIP-10 (Ethereum mainnet)
  
    const query = `
      query NamesByOwner($owner: AddressCAIP10!) {
        names(
          ownedBy: [$owner]
        ) {
          items {
            name
            expiresAt
            tokenizedAt
            registrar {
              name
              ianaId
              websiteUrl
            }
            claimedBy
            tokens {
              networkId
              ownerAddress
              startsAt
              expiresAt
              explorerUrl
              tokenAddress
              createdAt
              chain {
                name
              }
            }
          }
          totalCount
          pageSize
          currentPage
          totalPages
        }
      }
    `;
  
    let allNames = [];
    let skip = 0;
    const take = 50; // max per page is 100
  
    while (true) {
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query,
          variables: { owner: ownerCAIP10, skip, take },
        }),
      });
  
      const { data } = await response.json();
  
      if (!data?.names?.items) break; // no results or error
  
      allNames = allNames.concat(data.names.items);
  
      if (data.names.items.length < take) break; // no more pages
      skip += take;
    }
  
    return allNames;
  };
  