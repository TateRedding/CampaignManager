module.exports = {
    module: {
        rules: [
            {
                exclude: /node-modules/,
                test: /\.js$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: {
                            presets: ['@babel/preset-react']
                        }
                    }
                ]
            }
        ]
    }
}