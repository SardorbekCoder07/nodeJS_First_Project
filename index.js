const { log } = require('console');
const fs = require('fs');
const http = require('http');
const { Logger } = require('sass');
const URL = require('url')

//////////////////////////////////////////////////////////////////
//FILES


// const varib=fs.readFileSync('./txt/input.txt','utf-8')
// const textOut=`This is what we know about the avacado: ${varib}.\nCreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textOut)
// console.log('file written')

//This is section async code
// fs.readFile('./txt/start.txt','utf-8',(err,data1)=>{
//     fs.readFile(`./txt/${data1}.txt`,'utf-8',(err,data2)=>{
//         console.log(data2)
//         fs.readFile('./txt/append.txt','utf-8',(err,data3)=>{
//             console.log(data3);
//             fs.writeFile('./txt/final.txt',`Here is the text;${data2}\n${data3}`,'utf-8',err=>{
//                 console.log('your file has been written');
//             })
//         })
//     })
// })
// console.log('will read file')
//////////////////////////////////////////////////////////////////
// //SERVER
// const server=http.createServer((req,res)=>{
//     console.log(req);
//     res.end('Hello from the server')
// })
// server.listen(8000,'127.0.0.1',()=>{
//     console.log('listening on port 7000');
// })
const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName)
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%DESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)

    if (!product.organic) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')

    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8')
const tempСard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8')
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8')
const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8')
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {

    const { query, pathname } = URL.parse(req.url, true);

    //Overview page 
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el => replaceTemplate(tempСard, el)).join('')
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)

        res.end(output);

        //Product page 
    } else if (pathname === '/product') {
        res.writeHead(200, { 'Content-type': 'text/html' });
        const product = dataObj[query.id]
        const output=replaceTemplate(tempProduct,product)
        res.end(output);

        //Overview page 
    } else if (pathname === '/api') {
        res.writeHead(200, {
            'Content-type': 'application/json',
        });
        res.end(data);

        //Not found
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>OOOO page not found</h1>');
    }
});

server.listen(8000, '127.0.0.1', () => {
    console.log('Server is running on port 8000');
});
