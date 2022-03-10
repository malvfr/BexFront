import { Channel } from "phoenix";
import { useEffect, useState, useContext } from "react";
import { CoinSymbols } from "../coins";
import SocketContext from "../context/SocketContext";
import usePrevious from "../hooks/usePrevious";

type Props = {
    symbol: CoinSymbols
}

const Card = ({ symbol }: Props) => {
    const [price, setPrice] = useState(0);
    const lastPrice = usePrevious(price);
    const [channel, setChannel] = useState<Channel>();
    const socket = useContext(SocketContext);

    useEffect(() => {
        const lobby = "futures:lobby";

        const phxChannel = socket.channel(`${lobby}:${symbol}`, {});

        phxChannel
            .join()
            .receive("ok", (resp) => {
                console.debug(`Joined channel! ${symbol}`, resp);
                setChannel(phxChannel);
            })
            .receive("error", (resp) => {
                console.error("Unable to join", resp);
            });

        return () => {
            console.debug(`left channel! ${symbol}`);
            phxChannel.leave() as any;
        };
    }, [socket, symbol]);

    if (!channel) {
        return <></>;
    }

    channel.on("price_change", (resp: any) => setPrice(Number(resp.p)));

    const handleBob = () => {
        channel.push("ping", { k: 123 }).receive("ok", resp => { debugger; })
    }
    return (
        <div>
            <button onClick={handleBob}>Bob</button>

            <h1
                style={
                    lastPrice && price > lastPrice
                        ? { color: "green" }
                        : { color: "red" }
                }
            >
                {price.toFixed(4)}
            </h1>
        </div>
    );
};

export default Card;