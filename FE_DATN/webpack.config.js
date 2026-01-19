const path = require('path');
const Dotenv = require('dotenv-webpack');

module.exports = {
    // Entry file chính của dự án
    entry: './src/index.js',

    // Đầu ra file sau khi biên dịch
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: 'bundle.js',
    },

    // Cấu hình module để xử lý các loại file
    module: {
        rules: [
            {
                test: /\.scss$/, // Xử lý các file .scss
                use: [
                    'style-loader', // Chèn CSS vào DOM
                    'css-loader',   // Biên dịch CSS
                    {
                        loader: 'sass-loader', // Biên dịch SCSS thành CSS
                        options: {
                            sassOptions: {
                                includePaths: [
                                    path.resolve(__dirname, 'node_modules') // Cho phép import từ node_modules
                                ],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.(png|jpe?g|gif|svg)$/i, // Xử lý các file hình ảnh
                type: 'asset/resource',
            },
        ],
    },

    // Tích hợp các plugin
    plugins: [
        new Dotenv({
            path: './.env', // Đường dẫn đến file .env
            safe: false,    // Không yêu cầu file .env.example
        }),
    ],

    // Tùy chọn để đơn giản hóa import
    resolve: {
        extensions: ['.js', '.jsx', '.scss'], // Hỗ trợ import các loại file này mà không cần ghi đuôi
    },

    // Chế độ phát triển
    mode: 'development',
};