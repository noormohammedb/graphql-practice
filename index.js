const app = require("express")();

const port = process.env.PORT || 9909 
const userData = require("./MOCK_DATA.json")

app.listen(port, () => {
    console.log(`app listening on ${port}`);
})