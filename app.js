const { Console, log, error } = require("console");
const express = require("express");
const mongoose = require("mongoose");
const _=require("lodash");
const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb+srv://admin-arbaz:Test-123@cluster0.b1sjoaq.mongodb.net/todolistDB");
const itemsSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "yr koi name ta de inu"]
    }
});
const Item = new mongoose.model("Item", itemsSchema);
const item1 = new Item({
    name: "Welcome to our todoList"
});
const item2 = new Item({
    name: "Hit + button to add a new item"
});
const item3 = new Item({
    name: "<-- Hit this button to delete an item"
});
const defaultItems = [item1, item2, item3];
const listSchema = new mongoose.Schema({
    name: String,
    items: [itemsSchema]
});
const List = new mongoose.model("List", listSchema);
app.set("view engine", "ejs");

app.get("/", async function (req, res) {
    try {
        let foundItems = await Item.find({});
        if (foundItems.length === 0) {
            await Item.insertMany(defaultItems);
            res.redirect("/");
            console.log("default list added");
        }
        else {
            res.render("list", { listTitle: "Today", listItems: foundItems });
        }
    }
    catch (error) {
        console.error(error);
    }
});

app.get("/list/:customListName", async function (req, res) {
        let customListName = _.capitalize(req.params.customListName);
    try {
        let foundList = await List.findOne({ name: customListName });
        if (foundList) {
            res.render("list", { listTitle: foundList.name, listItems: foundList.items });
        }
        else {
            const list = new List({
                name: customListName,
                items: defaultItems
            });
            await list.save();
            res.redirect("/list/" + customListName);
            console.log('Custom list added');
        }
    }
    catch (error) {
        console.error(error);
    }
});


app.post("/", async function (req, res) {
    try {
        let itemName = req.body.addItem;
        let listName = req.body.button;
        let item = new Item({
            name: itemName
        });
        if (listName === "Today") {
             await item.save();
            res.redirect("/");
        }
        else {
            let foundList = await List.findOne({ name: listName });
            foundList.items.push(item);
            await foundList.save();
            res.redirect("/list/" + listName);
        }
    }
    catch (error) {
        console.error(error);
    }

});


app.post("/delete", async function (req, res) {
    try {
        const checkedItemId = req.body.checkBox;
        const listName = req.body.listName;
        if (listName === "Today") {
            await Item.findByIdAndDelete(checkedItemId);
            res.redirect("/");
        }
        else {
            await List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } });
            res.redirect("/list/" + listName);
        }
    }
    catch (error) {
        console.error(error);
    }

});
app.get("/about", function (req, res) {
    res.render("about");
});

app.listen(3000, function () {
    console.log("server started at port 3000");
}); 

