const express = require('express')
const app = express()
const port = 3000
const conf = {
    host: 'mysql',
    user: 'root',
    password: 'root',
    database: 'nodedb'
}
const mysql = require('mysql')
const connection = mysql.createConnection(conf)

const sql = `INSERT INTO people(name) values('Marcos')`
connection.query(sql)
//connection.end



app.get('/', (req,res) => {
    const users = connection.query("SELECT * FROM people", function (err, result, fields) {
        if (err) throw err;
        //console.log('Result ' + result.length)
        //for(var i = 0; i<result.length; i++ ){     
        //    console.log(result[i]);
        //}
        html = '<ul>'
        Object.keys(result).forEach(function(key) {
            var row = result[key];
            html += "<li>" + row.id + " " +row.name + "</li>"
          });
        html += '</ul>'

        resposta = '<h1>Full Cycle Rocks!</h1>' + html
        res.send(resposta)
    });  
})

app.listen(port, () => {
    console.log('Rodando na porta ' + port)
})