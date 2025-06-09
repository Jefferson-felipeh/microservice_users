#Imagem docker para criar um container que irá rodar essa aplicação no docker_

#Usar uma imagem base do Node.js_
#node tem que estar na mesma versão em que a aplicação foi construida_</p>
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
EXPOSE 3030

CMD ["npx","nest","start"]