Instalação do cli do nest na aplicação_
npm install @nestjs/cli

Instalação do ORM typeorm e do banco de dados sqlite3_
npm install @nestjs/typeorm typeorm sqlite sqlite3

Configurações globais da aplicação que nos permite utilização das variaveis de ambiente em toda aplicação_
npm install @nestjs/config

Pacotes para validação e transformação de dados_
npm install class-validator class-transformer

Documentando a api_
npm install @nestjs/swagger

Instalação da biblioeca bcrypt para hashear a senha_
npm install bcrypt

Biblioteca para criar microservice_
npm install @nestjs/microservices

Irei utilizar o RabbitMQ para comunicação eficiente entre os microserviços_
npm install amqplib

//Foi necessário instalar a biblioteca amqp-connection-manager para funcionamento do microservice_
npm install amqp-connection-manager

----------------------------------------------------------------------------------
Estrutura dos módulos de usuários_
Dados Básicos:
    id, firstname, lastname, email password, cep, age, createdAt, updatedAt, deletedAt

Dados do Perfil: 
    headline, about, location, profile_picture, banner_image, skills, experience, education

Conexões e Interações:
    connections, followers, post, likes, comments

Segurança e Autenticação:
    role, is_verified, auth_provider
--------------------------------------------------------------------------------------------------------------

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

O módulo de usuário será o responsável por criar um novo usuário, e por enviar uma série de eventos ou menságens a outros microservices,
logo o Users será o Producer, aquele que envia uma menságem, informação ou evento para os consumer, os que vão consumir esses eventos.
O broker utilizado será o rabbitmq, que será o que vai receber a menságem enviada pelo producer(users) e a enviará para o consumer(demais microservices);

Logo, o producer precisará de uma determinada configuração:

O users terá duas configurações para se tornar um microservice, primeiro, no User.Module.ts,será necessário fazer essa configuração:
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

Após isso, preciso criar o cliente proxy no próprio repositório, e emitir um evento ao consumer quando crio um novo usuário, por exemplo, dessa forma: 

Dentro do repository do módulo users: 
constructor( @Inject('NOTIFICATIONS_SERVICE') client:Clientproxy){}

E dentro do método de criar um novo usuário, ao criar o usuário, eu posso enviar um evento ao consumer com os dados do usuário criado usando esse clientProxy:
create(...){
    ...
    //this.client.emit('O primeiro argumento é o nome da fila do consumer',o segundo argumento é os dados do usuário criado);
    this.client.emit('notifications_ms_user_created',data);
    //Podemos definir o nome da fila do rabbitmq como desejar, porem no consumer, eu tenho que esta escutando essa final no controller;
}

Para utilizar o rabbitmq em um docker interno, é preciso criar uma imagem docker do rabbitmq e deixa-la rodando no docker, para so assim termos a possibilidade
de conectar nossos microservices ao docker, e utiliza-lo como broker na nossa aplicação;

Após criar a imagem docker do rabbitmq e o seu container, iremos criar a imagem dos nossos microservices e os seus respectivos conteiner_

 Para isso, dentro de cada microservice, iremos criar um arquivo dockerfile:
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

    Como criamos uma imagem e um container para o nosso microservice e subimos ele no docker,
    seria super necessário fazermos o mesmo com o banco de dados mongodb que esta sendo utilizado no microservice