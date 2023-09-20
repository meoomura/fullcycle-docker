# Arquitetura Hexagonal

```
# rodando ambiente de desenvolvimento no docker
docker compose up -d
docker exec -it appproduct bash
#obs o comando RUN go get -u github.com/spf13/cobra@latest no dockerfile não executou
# executado manualmente no container
go get -u github.com/spf13/cobra@latest
```

```
#mockgen
mockgen -destination=application/mocks/application.go -source=application/product.go
```

```
# Criar banco de dados sqlite3

# criar o arquivo do banco
touch sqlite.db 

# Entrar no sqlite
sqlite3 sqlite.db

# criar a tabels products
create table products(id string, name string, price float, status string);
```

```
# iniciar o cobra (command line inteface)
cobra-cli init 
cobra-cli add cli


#comandos
go run main.go cli -a=create -n="Product cli" -p=25.1
go run main.go cli -a=get --id=c46f52c0-20d0-436e-b7f2-082e0b2194cc

#cobra para o http
cobra-cli add http
```
