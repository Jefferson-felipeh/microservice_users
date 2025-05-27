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
----------------------------------------------------------------------------------

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