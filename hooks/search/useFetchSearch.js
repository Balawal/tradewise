import { useState, useEffect } from "react";
import { REACT_APP_BASE_URL } from "@env";

export default function useFetchSearch(searchTerm) {
    const [searchResult, setSearchResult] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSearchResults = async () => {
            if (!searchTerm.trim()) return;

            setIsLoading(true);
            try {
                const stockResponse = fetch(`${REACT_APP_BASE_URL}/search-query?keywords=${searchTerm}`);
                const cryptoResponse = fetch(`${REACT_APP_BASE_URL}/search-query-crypto?query=${searchTerm}`);
                const [stocksData, cryptoData] = await Promise.all([stockResponse, cryptoResponse]);

                const stockResults = await stocksData.json();
                const cryptoResults = await cryptoData.json();

                const combinedResults = [
                    ...stockResults.bestMatches.map(match => ({
                        symbol: match["1. symbol"],
                        name: match["2. name"],
                        type: "stock",
                    })),
                    ...cryptoResults.coins.map(coin => ({
                        symbol: coin.symbol,
                        name: coin.name,
                        id: coin.id,
                        type: "crypto",
                    })),
                ];

                setSearchResult(combinedResults);
            } catch (err) {
                setError("Error fetching search data");
                console.error("Error fetching search data:", err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchSearchResults();
    }, [searchTerm]);

    return { 
        searchResult, 
        isLoading, 
        error 
    };
};