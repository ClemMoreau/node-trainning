"use strict";

const opts = {
    querystring: {
        category: { type: "string" },
        id: { type: "integer" },
    },
};

export default async function (fastify, opts) {
    function monitorMessages(socket) {
        socket.on("message", (data) => {
            try {
                const { cmd, payload } = JSON.parse(data);
                if (cmd === "update-category") {
                    sendCurrentOrders(payload, socket);
                }
            } catch (err) {
                fastify.log.warn(
                    "Websocket Message (data: %o) Error: %s",
                    data,
                    err.message
                );
            }
        });
    }

    function sendCurrentOrders(category, socket) {
        for (const order of fastify.currentOrders(category)) {
            socket.send(order);
        }
    }

    fastify.get("/:category", { websocket: true }, async (socket, request) => {
        monitorMessages(socket);
        sendCurrentOrders(request.params.category, socket);
        for await (const order of fastify.realTimeOrders()) {
            console.log(order);

            if (socket.readyState >= socket.CLOSING) break;
            socket.send(order);
        }
    });

    fastify.post("/:id", async (request) => {
        const { id } = request.params;
        fastify.addOrder(id, request.body.amount);

        return { ok: true };
    });
}
