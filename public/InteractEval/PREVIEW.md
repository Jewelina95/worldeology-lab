# InteractNet website — local preview

This package contains the current static website, including its data, images, fonts, and latest editable comic assets. No build step is required.

## 预览方法

1. 解压整个压缩包。
2. 在 `InteractNet-website` 文件夹中打开终端。
3. 执行：

   ```sh
   python -m http.server 8080 --bind 127.0.0.1
   ```

4. 浏览器打开 **http://127.0.0.1:8080/**。
5. 在终端按 `Ctrl+C` 停止预览服务。

请通过本地 HTTP 服务打开，直接双击 `index.html` 会导致浏览器阻止读取部分 JSON 数据。

## Included revision

- Main headline: “The measure of intelligence is the ability to change”.
- Paper-aligned definitions of responsive and interactive intelligence.
- Results arranged in the requested paper order, without section numbers in the UI.
- Latest comic: `assets/research/figure1/figure1-static-v4.png`.
- Editable composite: `assets/research/figure1/figure1-static-v4.svg`.
- Twenty independent SVG/PNG dialogue and annotation components: `assets/research/figure1/dialogue-components-v4/`.
- Background A icon has a transparent background; Background B t₁ uses the matching rounded speech bubble.

The package is a local snapshot. Creating this ZIP does not publish or update the online website. Git history is excluded.
