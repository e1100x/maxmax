# Minimax - AI 视频生成前端

这是 AI 视频生成平台的前端应用，使用 Next.js 构建。

## 设置

1. 安装依赖：
   ```bash
   npm install
   ```

2. 设置环境变量：
   在根目录创建一个 `.env.local` 文件，并添加以下变量：
   ```bash
   NEXT_PUBLIC_TARGET_URL=https://hailuoai.com
   NEXT_PUBLIC_API_BASE_URL=/api/proxy
   NEXT_PUBLIC_TOKEN=
   NEXT_PUBLIC_YY=
   ```

   注意：`NEXT_PUBLIC_TOKEN` 和 `NEXT_PUBLIC_YY` 的值默认为空。如果未设置，应用将使用硬编码的默认值。

3. 运行开发服务器：
   ```bash
   npm run dev
   ```

应用将在 `http://localhost:3000` 上可用。

## 使用

- 主要组件 `VideoPlatform`（位于 `components/video-platform.tsx`）处理视频生成和显示功能。
- API 调用通过代理服务器进行，代理服务器需要单独设置。

## 安全注意事项

确保在生产环境中妥善保护敏感信息，如令牌。当前使用环境变量的设置适用于开发，但在生产环境中可能需要增强安全措施。

## 贡献

欢迎提交 Pull Requests 来改进这个项目。对于重大更改，请先开 issue 讨论您想要改变的内容。

## 许可证

[MIT](https://choosealicense.com/licenses/mit/)
