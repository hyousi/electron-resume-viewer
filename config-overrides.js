// source: https://github.com/ant-design/ant-design-mobile/issues/3094
const {
    addLessLoader,
    fixBabelImports,
    override
} = require("customize-cra");

module.exports = {
    webpack: override(
        addLessLoader({
            javascriptEnabled: true
        }),
        fixBabelImports("babel-plugin-import", {
            libraryName: "antd-mobile",
            style: true
        })
    )
};