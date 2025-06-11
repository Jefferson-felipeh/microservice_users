## Instalação das Dependencias necessárias neste Microservice de usuários_

#### Instalação do cli do nest na aplicação_
<li>npm install @nestjs/cli</li>

#### Instalação do ORM typeorm e do banco de dados sqlite3_
<li>npm install @nestjs/typeorm typeorm sqlite sqlite3</li>

#### Configurações globais da aplicação que nos permite utilização das variaveis de ambiente em toda aplicação_
<li>npm install @nestjs/config</li>

#### Pacotes para validação e transformação de dados_
<li>npm install class-validator class-transformer</li>

#### Documentando a api com swagger_
<li>npm install @nestjs/swagger</li>

#### Instalação da biblioeca bcrypt para hashear a senha_
<li>npm install bcrypt</li>

#### Dependencias e bibliotecas para criar e definir o Microservice de usuários
<li>
    Biblioteca para criar microservice_
    <strong>npm install @nestjs/microservices</strong>
</li>
<li>
    Irei utilizar o RabbitMQ para comunicação eficiente entre os microserviços_
    <strong>npm install amqplib</strong>
</li>
<li>
    <p>Foi necessário instalar a biblioteca amqp-connection-manager para funcionamento do microservice_</p>
    <strong>npm install amqp-connection-manager</strong>
</li>

<li>
    O banco de dados utilizado nesse microservice é o PostgreSQL, para isso precisei instalar:
    <strong>npm install pg</strong>
</li>

<hr/>

### Estrutura dos módulos de usuários_
<li><strong>Dados Básicos:</strong></li>
    id, firstname, lastname, email password, cep, age, createdAt, updatedAt, deletedAt

<li><strong>Dados do Perfil:</strong></li>
    headline, about, location, profile_picture, banner_image, skills, experience, education

<li><strong>Conexões e Interações:</string></li>
    connections, followers, post, likes, comments

<li><strong>Segurança e Autenticação:</strong></li>
    role, is_verified, auth_provider

<hr/>

Quando estou lidando com microservices no nestjs,o ideal é que os métodos do service e repository retorne uma observable,
e não uma promise, especialmente quando usa a biblioteca @nestjs/microservices com transportes baseados em mensagem como
RabbitMQ.

<hr/>

Entidades Separadas:
-> Cadastro de Usuário: Entidade central e básica para cadastrar as informações do usuário;
-> Connections: Relaciona os usuários conectados entre si;
-> Followers: Gerencia os seguidores, quem segue quem;
-> Posts: Mantem as postagens e liga aos usuários que criou essas postagens;
-> Skills: Lista de Habilidades;
-> Experience: Lista de experiencia/Histórico profissional;
-> Education: Formação academica;

Microserviços para a categoria Usuário_
-> User Service(Cadastro de Usuário): gerenciamento de perfis e configuração de usuário;
-> Autenticação
-> Connections Service:Gerencia conexões entre usuários(Solicitações, aprovações);
-> Followers Service:Mantem a relação quem segue quem;
-> Posts Service:Garante a publicação, edição, curtidas e comentários de postagens;
-> Messaging Service(Mensageria): resposnável pelo chat e notificações em tempo real(via websocket com rabbitMQ);

 //Cargo atual ou descrição do usuário_
    @Column()
    headline:string

    //Biografia ou descrição do usuário_
    @Column()
    about:string

    //Cidade e pais do usuário_
    @Column()
    location:string

    //URL da foto de perfil_
    @Column()
    profile_pictures:string

    //URL da imagem d efundo_
    @Column()
    banner_image:string

    //Lista de habilidades_
    @Column()
    skills: SKILL[]

    //Historico profissional do usuário_
    @Column()
    experience: EXPERIENCE[]

    //Formação academica do usuário_
    @Column()
    education: EDUCATION[]

    //Ids de usuários conectados_
    @Column()
    connections: []

    //Lista de seguidores_
    @Column()
    followers: []

    //Ids das postagens feitas pelo usuário_
    @Column()
    posts: []

    //Lista das postagens curtidas_
    @Column()
    likes: []

    //Ids dos comentários feitos pelo usuário_
    @Column()
    comments: []

    //Tipo de conta_
    @Column()
    role:ROLE

    //Se o perfil foi verificado_
    @Column()
    is_verified:boolean

    //Método de login_
    @Column()
    auth_provider:[]
--------------------------------------------------------------------------------------------------------------

<p>
O módulo de usuário será o responsável por criar um novo usuário, e por enviar uma série de eventos ou menságens a outros microservices,
logo o Users será o Producer, aquele que envia uma mensagem, informação ou evento para os consumer, os que vão consumir esses eventos.
</p>
<p>
O broker utilizado será o rabbitmq, que será o que vai receber a menságem enviada pelo producer(users) 
e a enviará para o consumer(demais microservices);
</p>

##### Logo, o producer precisará de uma determinada configuração:

O users terá duas configurações para se tornar um microservice, primeiro, <strong>no User.Module.ts,será necessário fazer essa configuração</strong>:
ClientsModules([
    {
        //Nome do cliente/microservice/consumer_
        name: 'NOTIFICATIONS_SERVICE',
        //O transporte ou o broker a ser utilizado, que nesse caso especificamos que será o RabbitMQ_
        transporte: Transporte.RMQ,
        options: {
            //Url do endereço do broker, que nesse caso esta sendo utilizado o rabbitmq em um docker interno_
            urls: ['amqp://guest:guest@rabbitmq:5672'],
            queue: 'notifications_queue',
            queueOoptions:{
                durale: true
            }
        }
    }
]);

<p>Após isso, preciso criar o cliente proxy no próprio repositório, e emitir um evento ao consumer quando crio um novo usuário, por exemplo, dessa forma:</p>

###### Dentro do repository do módulo users: 
constructor( @Inject('NOTIFICATIONS_SERVICE') client:Clientproxy){}

E dentro do método de criar um novo usuário, ao criar o usuário, eu posso enviar um evento ao consumer com os dados do usuário criado usando esse clientProxy:
create(...){
    ...
    //this.client.emit('O primeiro argumento é o nome da fila do consumer',o segundo argumento é os dados do usuário criado);
    this.client.emit('notifications_ms_user_created',data);
    //Podemos definir o nome da fila do rabbitmq como desejar, porem no consumer, eu tenho que esta escutando essa final no controller;
}

<hr>

## 1. Criar a Imagem docker do RabbitMQ(broker) e os eu container:

<p>
Para utilizar o rabbitmq em um docker interno, é preciso criar uma imagem docker do rabbitmq e deixa-la rodando no docker, para so assim termos 
a possibilidade de conectar nossos microservices ao docker, e utiliza-lo como broker na nossa aplicação;
</p>

## 2. Criar as Imagens docker dos Microservices e os seus containers:

<p>
Após criar a imagem docker do rabbitmq e o seu container, iremos criar a imagem dos nossos microservices e os seus respectivos conteiner_
</p>

<p>Para isso, dentro de cada microservice, iremos criar um arquivo dockerfile:</p>
Arquivo dockerfile :
    #Imagem docker para criar um container que irá rodar essa aplicação no docker_

    #Usar uma imagem base do Node.js_
    #o node tem que estar na mesma versão em que a aplicação foi construida_
    FROM node:20

    #Definir diretório de tabalho dentro do container
    WORKDIR /app

    #Copiar arquivos essenciais para instalar dependencias_
    COPY package.json package-lock.json ./

    #Instalar dependencias_
    RUN npm install

    #Copiar o restante do código da aplicação_
    COPY . .

    #Expor a porta do nestjs_
    EXPOSE 3000

    CMD ["npx","nest","start"]
    
    Após criar ou construir a imagem docker no arquuivo dockerfile, o comando para subir essa imagem do nosso microservice para o docker é:
    docker build -t nome_da_imagem .

    E após subir a nossa imagem docker do nosso ms-users para o docker,iremos cria ro conteiner que vai rodar essa imagem_
    com o comando: 
        docker run -d -p 3030:3030 --name nome_do_container nome_daImagem_associada_ao_container

    Usar uma imagem base do Node.js, assim ficará a imagem do microservice_
    o node tem que estar na mesma versão em que a aplicação foi construida_
    FROM node:20

    Definir diretório de tabalho dentro do container
    WORKDIR /app

    Copiar arquivos essenciais para instalar dependencias_
    COPY package.json package-lock.json ./

    Instalar dependencias_
    RUN npm install

    Copiar o restante do código da aplicação_
    COPY . .

    Expor a porta do nestjs_
    EXPOSE 3030

    CMD ["npx","nest","start"]

<hr/>

#### Após subir a imagem docker tanto do RabbitMQ quando do próprio microsevice, irei criar a imagem do postgres_
<P>Para subir um container para o postgres, será necessário criar o arquivo docker-compose.yml_</p>
<p>Nesse arquivo irei criar a imagem do postgres para rodar em um container docker_</p>
<p>Ate então o postgres estava sendo rodado com o PostgreSQL Server, ou seja, localmente na máquina.</p>
<p>Entratando, ao subir o nosso microservice para um container docker, será necessário subir o nosso banco de dados.</p>
<p>Para isso, no arquivo docker-compose.yml contruiremos a imagem assim: </p>

services:
  postgres:
    image: postgres:15 //Versão da imagem do postgres;
    container_name: postgres
    environment:
      POSTGRES_DB: nome do banco de dados
      POSTGRES_USER: usuario
      POSTGRES_PASSWORD: 'senha entre aspas';
    ports:
      - "5432:5432" //Porta padrão do postgres;
    volumes:
      - postgres_data:/var/lib/postgresql/data //Diretório padrçao do postgres;

volumes:
  postgres_data:

<p>Para subir, é necessáio verificar se já não exista algum container rodando que tenha a mesma porta do postres, se sim dará erro ao ser executado.</p>
<p>Para subir  imagem e o container, executa o comando: <strong>docker-compose up -d</strong> e no docker desktop basta iniciar a execução do container.</p>
<p>
Após subirmos a imagem docker do postgres, e ao tentarmos fazer requisição no microservice para o postgres, talvés de erro
de que tal banco e tal tabela não foi criada.</p>

<p>Mas caso isso acontecer, basta executar o comando:
<strong>docker exec -it nome_do_container psql -U nome_do_usuário -d postgres</strong>
Com esse comando no terminal, voce consegue acessar o container docker, ou 'entrar' no container pelo terminal.
E lá voce pode executar comandos sql, como criar tabelas, criar banco de dados, e etc, como: 
CREATE DATABASE microservice_users; 
CREATE TABLE users (colunas);
etc...
</p>
<p>No arquivo docker-compose.yml eu consigo gerenciar as imagens e os containers docker da minha aplicação,
ou seja, nele eu consigo criar mais de uma imagem e mais de um container e executar todos no mesmo comando: 
<strong>dokcer-compose up -d</strong>
</p>

<hr/>


### Principais comandos docker_
<li>
    Executar um comando dentro de um container docker:
    <strong>docker exec -it nome_do_container psql -U nome_do_Usuário -d postgres</strong>
</li>

<li>
    Para um Container docker, finalizando o container sem remove-lo:
    <strong>docker stop nome_do_container</strong>
</li>

<li>
    Listar container ativos_
    <strong>docker ps</strong>
    <strong>docker-compose ps</strong>
</li>