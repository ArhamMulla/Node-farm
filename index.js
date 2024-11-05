const fs = require('fs');
const http = require('http');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replace-templete');

// const text=fs.readFileSync('./txt/input.txt','utf-8');
// console.log(text)

// const textout=`this is something we know about avocado\n${text}\ncreated on ${Date.now()}`;
// fs.writeFileSync('./txt/output.txt',textout);
// console.log('file written')

//async
// fs.readFile('./txt/start.txt','utf-8',(err,data)=>{
//     console.log(data)
//     fs.readFile(`./txt/${data}.txt`,'utf-8',(err,data1)=>{
//         console.log(data1);
//         fs.readFile(`./txt/append.txt`,'utf-8',(err,data2)=>{
//             console.log(data2);
//             fs.writeFile(`./txt/final.txt`,`${data1}\n${data2}`,err=>{
//                 console.log("your file has been updated");
//             })
//         })
//     })
// })

const tempOverview = fs.readFileSync(
  `${__dirname}/templates/templete-overview.html`,
  'utf-8'
); 
const tempCard = fs.readFileSync(
  `${__dirname}/templates/templete-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/templete-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataobj = JSON.parse(data);

const slugs = dataobj.map((el) => slugify(el.productName, { lower: true }));
console.log(slugs);
const server = http.createServer((req, res) => {
  // console.log(req.url);
  const { query, pathname } = url.parse(req.url, true);

  //overview
  if (pathname === '/' || pathname === '/overview') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const cardsHtml = dataobj
      .map((el) => replaceTemplate(tempCard, el))
      .join('');
    const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
    res.end(output);
  }
  //product
  else if (pathname === '/product') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    const product = dataobj[query.id];
    const output = replaceTemplate(tempProduct, product);
    res.end(output);
  }
  //api
  else if (pathname === '/api') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(data);
  }
  //not found
  else {
    res.writeHead(404, {
      'Content-type': 'text/html',
      'own-header': 'hello world',
    });
    res.end('<h1>page not found</h1>');
  }
});

server.listen(8000, '127.0.0.1', () => {
  console.log('server is listening to request on port 8000');
});
