"use strict";

import fp from "fastify-plugin";
import { PassThrough } from "stream";

const orders = {
    A1: { total: 3 },
    A2: { total: 7 },
    B1: { total: 101 },
};

const catToPrefix = {
    electronics: "A",
    confectionery: "B",
};

// V2
const orderStream = new PassThrough({ objectMode: true });
async function* realTimeOrders() {
    console.log("cc");

    for await (const { id, total } of orderStream) {
        console.log("Order stream: %o", { id, total });

        yield JSON.stringify({ id, total });
    }
}

// V1
async function* realTimeOrdersSimulator() {
    const ids = Object.keys(orders);
    while (true) {
        const delta = Math.floor(Math.random() * 7) + 1;
        const id = ids[Math.floor(Math.random() * ids.length)];
        orders[id].total *= delta;
        const { total } = orders[id];
        yield JSON.stringify({ id, total });
        await timeout(1500);
    }
}

function addOrder(id, amount) {
    if (orders.hasOwnProperty(id) === false) {
        const err = new Error(`Order ${id} not found`);
        err.status = 404;
        throw err;
    }

    if (Number.isInteger(amount) === false) {
        const err = new Error(`Amount ${amount} is not an integer`);
        err.status = 400;
        throw err;
    }

    orders[id].total += amount;
    const { total } = orders[id];
    console.log("Adding order: %o", { id, total });
    orderStream.write({ id, total });
}

function* currentOrders(category) {
    const idPrefix = catToPrefix[category];
    if (!idPrefix) return;

    const ids = Object.keys(orders).filter((id) => id[0] === idPrefix);
    for (const id of ids) {
        yield JSON.stringify({ id, ...orders[id] });
    }
}

const calculateId = (idPrefix, data) => {
    const sorted = [...new Set(data.map(({ id }) => id))];
    const next = Number(sorted.pop().slice(1)) + 1;
    return `${idPrefix}${next}`;
};

export default fp(async function (fastify, opts) {
    fastify.decorate("addOrder", addOrder);
    fastify.decorate("currentOrders", currentOrders);
    fastify.decorate("realTimeOrders", realTimeOrders);
    fastify.decorate("mockDataInsert", (request, category, data) => {
        const idPrefix = catToPrefix[category];
        const id = calculateId(idPrefix, data);

        orderStream.write({ id, ...request.body });
        // data.push({ id, ...request.body });
        // return data;
    });
});
