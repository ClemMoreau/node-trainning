import got from "got";
import {
    log,
    error,
    displayTimestamp,
    displayInfo,
    displayID,
    displayText,
    displayAmount,
    displaySuccess,
    displayCategory,
    displayName,
    displayKey,
    displayRRP,
} from "./displays.js";
import Enquirer from "enquirer";

const { prompt } = Enquirer;
const API = "http://localhost:3000";
const categories = ["confectionery", "electronics"];

export const update = async (id, amount) => {
    log(`${displayTimestamp()}`);
    log(
        `${displayInfo(`Updating Order`)} ${displayID(id)} ${displayText(
            "with amount"
        )} ${displayAmount(amount)}`
    );
    try {
        if (isNaN(+amount)) {
            error("Error: <AMOUNT> must be a number");
            process.exit(1);
        }
        await got.post(`${API}/orders/${id}`, {
            json: { amount: +amount },
        });

        log(
            `${displaySuccess()} ${displayText("Order")} ${displayID(
                id
            )} ${displayText("updated with amount")} ${displayAmount(amount)}`
        );
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
};

export const add = async (...args) => {
    let [category, id, name, amount, info] = args;
    log(`${displayTimestamp()}`);
    log(
        `${displayInfo(`Request to add item to category`)} ${displayCategory(
            category
        )}`
    );
    log(
        `${displayText("Adding item")} ${displayID(id)} ${displayText(
            "with amount"
        )} ${displayAmount(`$${amount}`)}`
    );
    try {
        if (isNaN(+amount)) {
            error(`Error: <AMOUNT> must be a number`);
            process.exit(1);
        }

        await got.post(`${API}/${category}`, {
            json: { id, name, rrp: +amount, info: info.join(" ") },
        });
        log(
            `${displaySuccess("Product Added! :")} ${displayID(
                id
            )} ${displayName(name)} ${displayText(
                "has been added to the"
            )} ${displayCategory(category)} ${displayText("category")}`
        );
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
};

export const listCategories = () => {
    log(`${displayTimestamp()}`);
    log(`${displayInfo(`Listing categories`)}`);
    try {
        log(displayText("Categories received from API:"));
        for (const cat of categories) log(`${displayCategory(cat)}`);
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
};

export const listCategoryItems = async (category) => {
    log(displayTimestamp());
    log(`${displayInfo(`List IDs`)}`);
    try {
        const res = await got
            .get(`${API}/${category}`, {
                responseType: "json",
            })
            .json();

        log(`${displaySuccess("IDs received from API:")}`);
        for (const item of res) {
            log(`
                ${displayKey("ID:")}\t${displayID(item.id)}
                ${displayKey(`Name:`)}\t${displayName(item.name)}
                ${displayKey("RRP:")}\t${displayRRP(item.rrp)}
                ${displayKey("Product Info:")}\n\t${displayText(item.info)}
            `);
        }
    } catch (err) {
        error(err.message);
        process.exit(1);
    }
};

const categoryQuestions = [
    {
        type: "autocomplete",
        name: "category",
        message: "Category",
        choices: categories,
    },
];

export const promptListIds = async () => {
    const { category } = await prompt(categoryQuestions);
    return listCategoryItems(category);
};

const orderQuestions = [
    ...categoryQuestions,
    {
        type: "input",
        name: "id",
        message: "ID",
    },
    {
        type: "input",
        name: "name",
        message: "Name",
    },
    {
        type: "input",
        name: "amount",
        message: "Amount",
    },
    {
        type: "input",
        name: "info",
        message: "Info",
    },
];

export const pormptAddOrder = async () => {
    // const { category, id, name}
};
