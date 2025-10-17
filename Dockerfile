# 使用 Node.js 24 版本的基础镜像
FROM node:24.10.0-slim

# 创建工作目录
RUN mkdir -p /var/www/nuxt-app
WORKDIR /var/www/nuxt-app

# 复制 package.json 和 package-lock.json（如果有的话）
COPY package*.json ./

# 安装 pnpm
RUN npm i -g pnpm

# 使用 pnpm 安装依赖
RUN pnpm i

# 复制项目文件到工作目录
COPY . .

# 构建项目
RUN pnpm build

# 声明容器运行时的端口
EXPOSE 3000

# 容器启动时运行的命令
CMD ["pnpm", "run", "start"]