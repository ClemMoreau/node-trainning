#!/usr/bin/env node

import { Command } from "commander";
import {
    add,
    update,
    listCategories,
    listCategoryItems,
} from "../src/utils.js";

const program = new Command()
    .name("my-cli")
    .description("CLI Back office for My App")
    .version("1.0.0");

program
    .command("update")
    .argument("<ID>", "Order ID")
    .argument("<AMOUNT>", "Order Amount")
    .action(async (id, amount) => await update(id, amount));

program
    .command("add")
    .description("Add Product by ID to a Category")
    .argument("<CATEGORY>", "Product Category")
    .argument("<ID>", "Product ID")
    .argument("<NAME>", "Product Name")
    .argument("<AMOUNT>", "Product RPP")
    .argument("[INFO...]", "Product Info")
    .action(
        async (category, id, name, amount, info) =>
            await add(category, id, name, amount, info)
    );

program
    .command("list")
    .description("List all categories")
    .argument("[CATEGORY]", "Category to list IDs for")
    .option("-a, --all", "List all categories")
    .action(async (args, opts) => {
        if (args && opts.all)
            throw new Error("Cannot specify both args and 'all'");
        if (opts.all || args === "all") {
            listCategories();
        } else if (args === "confectionery" || args === "electronics") {
            listCategoryItems(args);
        } else {
            throw new Error("Invalid category specified");
        }
    });

program.parse();
