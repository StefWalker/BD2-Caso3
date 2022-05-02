// Grupo 1 (espacios libres y tomados) --------------------------------------------------------------------------


// Creamos volúmenes
docker volume create volespcostarica1
docker volume create volespcostarica2
docker volume create volespfrancia1
docker volume create volespfrancia2

// Se crean las bases de datos
docker run -dp 27017:27017 -v volespcostarica1:/data/db --name espcostarica1 mongo mongod --port 27017 --replSet "repesppaises1" --dbpath /data/db
docker run -dp 27018:27017 -v volespcostarica2:/data/db --name espcostarica2 mongo mongod --port 27017 --replSet "repesppaises1" --dbpath /data/db
docker run -dp 27019:27017 -v volespfrancia1:/data/db --name espfrancia1 mongo mongod --port 27017 --replSet "repesppaises1" --dbpath /data/db
docker run -dp 27020:27017 -v volespfrancia2:/data/db --name espfrancia2 mongo mongod --port 27017 --replSet "repesppaises1" --dbpath /data/db

// Inicializamos las réplicas
docker exec -it espcostarica1 mongo
rs.initiate({
    _id: "repesppaises1",
    members: [
        {_id: 0, host: "25.3.49.102:27017"},
        {_id: 1, host: "25.3.49.102:27018"},
        {_id: 2, host: "25.3.49.102:27019"},
        {_id: 3, host: "25.3.49.102:27020"},
    ]
});
exit


docker volume create volespitalia1
docker volume create volespitalia2
docker volume create volespgrecia1
docker volume create volespgrecia2

docker run -dp 27017:27017 -v volespitalia1:/data/db --name espitalia1 mongo mongod --port 27017 --replSet "repesppaises2" --dbpath /data/db
docker run -dp 27018:27017 -v volespitalia2:/data/db --name espitalia2 mongo mongod --port 27017 --replSet "repesppaises2" --dbpath /data/db
docker run -dp 27019:27017 -v volespgrecia1:/data/db --name espgrecia1 mongo mongod --port 27017 --replSet "repesppaises2" --dbpath /data/db
docker run -dp 27020:27017 -v volespgrecia2:/data/db --name espgrecia2 mongo mongod --port 27017 --replSet "repesppaises2" --dbpath /data/db

docker exec -it espitalia1 mongo
rs.initiate({
    _id: "repesppaises1",
    members: [
        {_id: 0, host: "25.6.180.2:27017"},
        {_id: 1, host: "25.6.180.2:27018"},
        {_id: 2, host: "25.6.180.2:27019"},
        {_id: 3, host: "25.6.180.2:27020"},
    ]
});
exit



// Grupo 2 (órdenes de envío) -----------------------------------------------------------------------------------


// Creamos los volumenes de los servidores de configuración
docker volume create volconfigord1
docker volume create volconfigord2


// Creamos los servidores de configuración
docker run -dp 27021:27017 -v volconfigord1:/data/configdb --name configord1 mongo mongod --port 27017 --configsvr --replSet "repconfigord" --dbpath /data/configdb
docker run -dp 27022:27017 -v volconfigord2:/data/configdb --name configord2 mongo mongod --port 27017 --configsvr --replSet "repconfigord" --dbpath /data/configdb


// Se inicia la réplica de los servidores de configuración
docker exec -it configord1 mongo
rs.initiate({
    _id: "repconfigord",
    configsvr: true,
    members: [
        {_id: 0, host: "25.6.180.2:27021"},
        {_id: 1, host: "25.6.180.2:27022"},
    ]
});
exit


// Se crean los volúmenes de las bases de datos
docker volume create volordcostarica1
docker volume create volordcostarica2
docker volume create volordfrancia1
docker volume create volordfrancia2


// Se crean las bases de datos de los paises
docker run -dp 27021:27017 -v volordcostarica1:/data/db --name ordcostarica1 mongo mongod --port 27017 --shardsvr --replSet "repordpaises1" --dbpath /data/db
docker run -dp 27022:27017 -v volordcostarica2:/data/db --name ordcostarica2 mongo mongod --port 27017 --shardsvr --replSet "repordpaises1" --dbpath /data/db
docker run -dp 27023:27017 -v volordfrancia1:/data/db --name ordfrancia1 mongo mongod --port 27017 --shardsvr --replSet "repordpaises1" --dbpath /data/db
docker run -dp 27024:27017 -v volordfrancia2:/data/db --name ordfrancia2 mongo mongod --port 27017 --shardsvr --replSet "repordpaises1" --dbpath /data/db


// Se entra a uno de los servidores de cada réplica y se inicia la replicación
docker exec -it ordcostarica1 mongo
rs.initiate({
    _id: "repordpaises1",
    members: [
        {_id: 0, host: "25.3.49.102:27021"},
        {_id: 1, host: "25.3.49.102:27022"},
        {_id: 2, host: "25.3.49.102:27023"},
        {_id: 3, host: "25.3.49.102:27024"}
    ]
});
exit

docker volume create volorditalia1
docker volume create volorditalia2
docker volume create volordgrecia1
docker volume create volordgrecia2


// Se crean las bases de datos de los paises
docker run -dp 27023:27017 -v volorditalia1:/data/db --name orditalia1 mongo mongod --port 27017 --shardsvr --replSet "repordpaises2" --dbpath /data/db
docker run -dp 27024:27017 -v volorditalia2:/data/db --name orditalia2 mongo mongod --port 27017 --shardsvr --replSet "repordpaises2" --dbpath /data/db
docker run -dp 27025:27017 -v volordgrecia1:/data/db --name ordgrecia1 mongo mongod --port 27017 --shardsvr --replSet "repordpaises2" --dbpath /data/db
docker run -dp 27026:27017 -v volordgrecia2:/data/db --name ordgrecia2 mongo mongod --port 27017 --shardsvr --replSet "repordpaises2" --dbpath /data/db

docker exec -it orditalia1 mongo
rs.initiate({
    _id: "repordpaises2",
    members: [
        {_id: 0, host: "25.6.180.2:27023"},
        {_id: 1, host: "25.6.180.2:27024"},
        {_id: 2, host: "25.6.180.2:27025"},
        {_id: 3, host: "25.6.180.2:27026"}
    ]
});
exit


// Se crean los servidores árbitro para cada país
docker run -dp 27025:27017 --name arbordpaises1 mongo mongod --port 27017 --replSet repordpaises1

docker exec -it ordcostarica1 mongo
rs.addArb("25.3.49.102:27025");
exit

docker run -dp 27027:27017 --name arbordpaises2 mongo mongod --port 27017 --replSet repordpaises2

docker exec -it ordcostarica1 mongo
rs.addArb("25.6.180.2:27027");
exit

// Creación de router junto con adición de shards
docker run -dp 27028:27017 --name routerordenes1 mongo mongos --port 27017 --configdb repconfigord/25.6.180.2:27021,25.6.180.2:27022 --bind_ip 0.0.0.0

docker exec -it routerordenes1 mongo

sh.addShard("repordpaises1/25.3.49.102:27021");
sh.addShard("repordpaises1/25.3.49.102:27023");
sh.addShard("repordpaises2/25.6.180.2:27023");
sh.addShard("repordpaises2/25.6.180.2:27025");

sh.addShardTag("repordpaises1","costa rica");
sh.addShardTag("repordpaises1","francia");
sh.addShardTag("repordpaises2","italia");
sh.addShardTag("repordpaises2","grecia");

sh.addTagRange(
    "ubertainer.ordenesEnvio",
    {pais: "costa rica"},
    {pais: "costa rica0"},
    "costa rica"
);

sh.addTagRange(
    "ubertainer.ordenesEnvio",
    {pais: "francia"},
    {pais: "francia0"},
    "francia"
);

sh.addTagRange(
    "ubertainer.ordenesEnvio",
    {pais: "italia"},
    {pais: "italia0"},
    "italia"
);

sh.addTagRange(
    "ubertainer.ordenesEnvio",
    {pais: "grecia"},
    {pais: "grecia0"},
    "grecia"
);

sh.enableSharding("ubertainer");
sh.shardCollection("ubertainer.ordenesEnvio", {pais: 1});

exit


// Cluster de Redis ---------------------------------------------------------------------------------------------

docker run -dp 6379:6379 --name redis1 redis
docker run -dp 6380:6379 --name redis2 redis
docker run -dp 6381:6379 --name redis3 redis



// Kafka

docker run -dp 2181:2181 --name zookeeper1 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper
docker run -dp 9092:9092 --name kafka1 -e KAFKA_BROKER_ID=2 -e KAFKA_LISTENERS=PLAINTEXT://:9092 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9092 -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2181 -e ALLOW_PLAINTEXT_LISTENER=yes bitnami/kafka

docker run -dp 2182:2181 --name zookeeper2 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper
docker run -dp 9093:9093 --name kafka2 -e KAFKA_BROKER_ID=1 -e KAFKA_LISTENERS=PLAINTEXT://:9093 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9093 -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2182 -e ALLOW_PLAINTEXT_LISTENER=yes bitnami/kafka

docker run -dp 2183:2181 --name zookeeper3 -e ALLOW_ANONYMOUS_LOGIN=yes bitnami/zookeeper
docker run -dp 9094:9094 --name kafka3 -e KAFKA_BROKER_ID=1 -e KAFKA_LISTENERS=PLAINTEXT://:9094 -e KAFKA_ADVERTISED_LISTENERS=PLAINTEXT://127.0.0.1:9093 -e KAFKA_ZOOKEEPER_CONNECT=host.docker.internal:2183 -e ALLOW_PLAINTEXT_LISTENER=yes bitnami/kafka