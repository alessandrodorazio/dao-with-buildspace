import { useAddress, useMetamask, useEditionDrop, useToken, useNetwork, useVote } from '@thirdweb-dev/react';

import { useState, useEffect, useMemo } from 'react';

const App = () => {
    const address = useAddress()

    const connectWithMetamask = useMetamask()
    const editionDrop = useEditionDrop("0xd5bf06D61223f332B84986Eb7BD04413cE732a75");
    const token = useToken("0x77471347642551f42724479961d066ba8ef7815c")
    const vote = useVote("0x82B40844cF5c59A836cD67bb7DA3d8259C35C5C0");
    const [hasClaimedNFT, setHasClaimedNFT] = useState(false);
    const [isClaiming, setIsClaiming] = useState(false);

    const [memberTokenAmounts, setMemberTokenAmounts] = useState([]);
    const [memberAddresses, setMemberAddresses] = useState([]);

    const shortenAddress = (str) => {
        return str.substring(0, 6) + "..." + str.substring(str.length - 4);
    };

    const [proposals, setProposals] = useState([]);
    const [isVoting, setIsVoting] = useState(false);
    const [hasVoted, setHasVoted] = useState(false);

    // Retrieve existing proposals from the contract.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Call to vote.getAll() to grab the proposals.
        const getAllProposals = async () => {
            try {
                const proposals = await vote.getAll();
                setProposals(proposals);
            } catch (error) {
                console.log("failed to get proposals", error);
            }
        };
        getAllProposals();
    }, [hasClaimedNFT, vote]);

    // Check if the user already voted.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        if (!proposals.length) {
            return;
        }

        const checkIfUserHasVoted = async () => {
            try {
                const hasVoted = await vote.hasVoted(proposals[0].proposalId, address);
                setHasVoted(hasVoted);
                if (hasVoted) {
                    console.log("🥵 User has already voted");
                } else {
                    console.log("🙂 User has not voted yet");
                }
            } catch (error) {
                console.error("Failed to check if wallet has voted", error);
            }
        };
        checkIfUserHasVoted();

    }, [hasClaimedNFT, proposals, address, vote]);

    // Grab all the addresses of our members holding our NFT.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        // Grab the users who hold our NFT with tokenId 0.
        const getAllAddresses = async () => {
            try {
                const memberAddresses = await editionDrop.history.getAllClaimerAddresses(0);
                setMemberAddresses(memberAddresses);
                console.log("🚀 Members addresses", memberAddresses);
            } catch (error) {
                console.error("failed to get member list", error);
            }

        };
        getAllAddresses();
    }, [hasClaimedNFT, editionDrop.history]);

    // Grab the # of token each member holds.
    useEffect(() => {
        if (!hasClaimedNFT) {
            return;
        }

        const getAllBalances = async () => {
            try {
                const amounts = await token.history.getAllHolderBalances();
                setMemberTokenAmounts(amounts);
                console.log("👜 Amounts", amounts);
            } catch (error) {
                console.error("failed to get member balances", error);
            }
        };
        getAllBalances();
    }, [hasClaimedNFT, token.history]);

    const memberList = useMemo(() => {
        return memberAddresses.map((address) => {

            const member = memberTokenAmounts?.find(({ holder }) => holder === address);

            return {
                address,
                tokenAmount: member?.balance.displayValue || "0",
            }
        });
    }, [memberAddresses, memberTokenAmounts]);

    useEffect(() => {
        if (!address) {
            return;
        }

        const checkBalance = async () => {
            try {
                const balance = await editionDrop.balanceOf(address, 0);
                if (balance.gt(0)) {
                    setHasClaimedNFT(true);
                    console.log("🌟 this user has a membership NFT!");
                } else {
                    setHasClaimedNFT(false);
                    console.log("😭 this user doesn't have a membership NFT.");
                }
            } catch (error) {
                setHasClaimedNFT(false);
                console.error("Failed to get balance", error);
            }
        };
        checkBalance();
    }, [address, editionDrop]);

    const mintNft = async () => {
        try {
            setIsClaiming(true);
            await editionDrop.claim("0", 1);
            console.log(`🌊 Successfully Minted! Check it out on OpenSea: https://testnets.opensea.io/assets/${editionDrop.getAddress()}/0`);
            setHasClaimedNFT(true);
        } catch (error) {
            setHasClaimedNFT(false);
            console.error("Failed to mint NFT", error);
        } finally {
            setIsClaiming(false);
        }
    };



    if (!address)
        return (
            <div className="landing">
                <h1>Welcome to ExamDAO</h1>
                <button onClick={connectWithMetamask}>
                    Connect your wallet
                </button>
            </div>
        );

    if (hasClaimedNFT) {
        return (
            <div className="member-page bg-gray-900">
                <h1>🍪DAO Member Page</h1>
                <p>Congratulations on being a member!!</p>
                <div>
                    <div>
                        <h2>Member List</h2>
                        <table className="card">
                            <thead>
                                <tr>
                                    <th>Address</th>
                                    <th>Token Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {memberList.map((member) => {
                                    return (
                                        <tr key={member.address}>
                                            <td>{shortenAddress(member.address)}</td>
                                            <td>{member.tokenAmount}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };
    return (
        <div className="landing">
            <h1>Welcome to ExamDAO!</h1>
            <p>You are connected</p>
            <button
                disabled={isClaiming}
                onClick={mintNft}
            >
                {isClaiming ? "Minting..." : "Mint your nft (FREE)"}
            </button>
        </div>
    );
};

export default App;
