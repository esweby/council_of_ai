import http from 'node:http';
import {readFile} from 'node:fs/promises';
const routes={'/':'index.html','/app.js':'app.js','/model.js':'model.js','/style.css':'style.css'};
const types={html:'text/html',js:'text/javascript',css:'text/css'};
http.createServer(async(req,res)=>{const file=routes[new URL(req.url,'http://localhost').pathname];if(!file){res.writeHead(404);return res.end('Not found');}try{const body=await readFile(new URL(file,import.meta.url));res.writeHead(200,{'Content-Type':types[file.split('.').pop()]+'; charset=utf-8','Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Content-Security-Policy':"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; img-src 'self' data:; object-src 'none'; base-uri 'none'; frame-ancestors 'none'"});res.end(body);}catch{res.writeHead(500);res.end('Could not read application file');}}).listen(4317,'127.0.0.1',()=>console.log('Council of AI: http://127.0.0.1:4317'));
