import { registerAs } from '@nestjs/config';

/* 
  Com o namespace(espaço nomeado), é agrupado e organizado as variáveis de ambiente do .env;
  Ele é uma abstração criada com registerAs() para facilitar o acesso e a organização das variáveis na aplicação;
  Ou seja, agrupa variáveis relacionadas em objetos nomeados;
  Eu consigo acessar o seu objeto nas configurações do typeorm usando o this.configService.get().
*/

export default registerAs('database', () => (
  {
    type: process.env.DB_TYPE,
    nome: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  }

));