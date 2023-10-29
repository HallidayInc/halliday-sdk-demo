import React, { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Halliday, BlockchainType, GetUserInfoResponse } from "halliday-sdk";
import LogInOptions from "./LogInOptions";

const hallidayClient = new Halliday(
    "BJuf3koY_dQC-s0rcN_nsXNd7WOez8uuW4ucz9CVaQRajHgTvwsTXX-aMnHxC-T-gF3e-tbTydi_8cthWfoBp2w:db7764df-c689-4244-ae3a-1406a757ae40",
    BlockchainType.MUMBAI,
    true
);

export const buttonStyle: React.CSSProperties = {
    border: "1px solid white",
    borderRadius: "2px",
    padding: "10px",
    cursor: "pointer",
    fontSize: "22px",
    userSelect: "none",
};
const buttonContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    width: "500px",
};

export default function Content() {
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>();
    const [signer, setSigner] = useState<ethers.JsonRpcSigner>();
    const [message, setMessage] = useState("");
    useEffect(() => {
        // useEffect can't take an async function, so we can do this instead.
        (async () => {
            const userInfo: GetUserInfoResponse | null = await hallidayClient.getUserInfo();
            if (userInfo) {
                const wallet = await hallidayClient.getOrCreateHallidayAAWallet(
                    userInfo.signer.address
                );
                setMessage(
                    "Your Halliday Smart Account: " +
                    JSON.stringify(wallet)
                );
                setIsLoggedIn(true);
                setSigner(userInfo.signer);
            } else {
                setIsLoggedIn(false);
            }
        })();
    }, []);

    function Button({onClick, children}: {onClick: () => Promise<void>, children: React.ReactNode}) {
        return (
            <div
                style={buttonStyle}
                onClick={async () => {
                    try {
                        setMessage("Loading...");

                        await onClick();
                    } catch (e: any) {
                        setMessage(
                            "error, e.response.data:" + JSON.stringify(e.response.data)
                        );
                    }
                }}
            >
                {children}
            </div>
        )
    }

    if (isLoggedIn == null) {
        return (
            <div style={{ fontSize: "22px" }}>
                Loading...
            </div>
        );
    }

    if (isLoggedIn == false || signer == null) {
        return (
            <div style={buttonContainerStyle}>
                <LogInOptions hallidayClient={hallidayClient} />
            </div>
        )
    }

    return (
        <div style={buttonContainerStyle}>
            <textarea
                style={{ padding: "10px" }}
                value={message}
                rows={5}
                readOnly
            />

            <Button onClick={async () => {
                const toSign = Date.now();
                const signature = await signer.signMessage(toSign.toString());
                setMessage(`signed Date.now ${toSign} from address ${signer.address}: ${signature}`);
            }}>
                Sign Date.now()
            </Button>

            <Button onClick={async () => {
                const res = await hallidayClient.getBalances(signer.address);
                setMessage(JSON.stringify(res));
            }}>
                Get Balances
            </Button>

            <Button onClick={async () => {
                const res = await hallidayClient.getAssets(signer.address);
                setMessage(JSON.stringify(res));
            }}>
                Get Assets
            </Button>

            <Button onClick={async () => {
                const tx_info = await hallidayClient.transferBalance({
                    from_in_game_player_id: signer.address,
                    to_in_game_player_id: "0x9C07Ab9bFBf6a6105b9E037C367619aC885C347F",
                    token_address: "0x0799ea468f812e40dbabe77b381cac105da500cd",
                    value: (10 ** 17).toString(),
                    sponsor_gas: true,
                });
                setMessage("tx_info: " + JSON.stringify(tx_info));
            }}>
                Transfer 0.1 CRV to other account
            </Button>

            <Button onClick={async () => {
                const tx_info = await hallidayClient.transferAsset({
                    from_in_game_player_id: signer.address,
                    to_in_game_player_id: "0x9e3D52aAFf68Dc93141641D2C5F0ba8b2A1B63a2",
                    collection_address: "0xeeaf9e39057002eae4bea8bb4e65b01a9cfd59be",
                    token_id: "3988",
                    sponsor_gas: true,
                });
                setMessage("tx_info: " + JSON.stringify(tx_info));
            }}>
                Transfer NFT to other account
            </Button>
            
            <Button onClick={async () => {
                const CRV_ADDRESS = "0x0799ea468F812e40DBABe77B381cac105Da500Cd";
                const contract = new ethers.Contract(CRV_ADDRESS, [
                    {
                        inputs: [
                        {
                            internalType: "address",
                            name: "recipient",
                            type: "address",
                        },
                        {
                            internalType: "uint256",
                            name: "amount",
                            type: "uint256",
                        },
                        ],
                        name: "transfer",
                        outputs: [
                            { internalType: "bool", name: "", type: "bool" },
                        ],
                        stateMutability: "nonpayable",
                        type: "function",
                    },
                ]);
                const calldata = contract.interface.encodeFunctionData(
                    "transfer",
                    [
                        "0x9e3D52aAFf68Dc93141641D2C5F0ba8b2A1B63a2",
                        (10 ** 17).toString(),
                    ]
                );
                const tx_info = await hallidayClient.callContract({
                    from_in_game_player_id: signer.address,
                    target_address: CRV_ADDRESS,
                    value: "0",
                    calldata,
                    sponsor_gas: true,
                });
                setMessage("tx_info: " + JSON.stringify(tx_info));
            }}>
                Call Contract (Send 0.1 CRV to EOA)
            </Button>

            <br />
            
            <Button onClick={async () => {
                await hallidayClient.logOut();
                setIsLoggedIn(false);
                setSigner(undefined);
            }}>
                Log Out
            </Button>
        </div>
    );
}