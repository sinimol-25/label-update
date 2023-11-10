"use strict";
const knex = require("knex")(strapi.config.get("database.connection"));

module.exports = ({ strapi }) => ({
  index(ctx) {
    ctx.body = strapi
      .plugin("name-converter")
      .service("myService")
      .getWelcomeMessage();
  },
  async updateLabel(ctx) {
    let tableName = "strapi_core_store_settings";
    let fields = await knex(`${tableName}`).select("*");

    for (let row of fields?.filter(function (row) {
      return (
        JSON.parse(row.value).uid?.startsWith("api::") ||
        JSON.parse(row.value).isComponent == true
      );
    })) {
      let jsonObject = JSON.parse(row.value);
      let metadata = jsonObject?.metadatas;
      let convertedObject = this.processMetadata(metadata);

      jsonObject.metadatas = convertedObject;
      try {
        await knex(tableName)
          .where("id", row?.id)
          .update({ value: JSON.stringify(jsonObject) });
        console.log("Update successful");
        return true;
      } catch (error) {
        console.error("Update failed:", error);
        return false;
      }
    }
  },
  processMetadata(metadata) {
    let rejectedColumns = ["id", "createdAt", "updatedAt", "publishedAt"];
    let fullUppercaseColumns = ["seo", "url"];
    Object.keys(metadata)
      .filter(function (meta) {
        return !rejectedColumns.includes(meta);
      })
      .forEach(function (column) {
        let columnData = metadata[column];
        let listData = columnData?.list;
        let editData = columnData?.edit;

        if (listData?.label === editData?.label) {
          if (fullUppercaseColumns.includes(column)) {
            editData.label = listData.label.toUpperCase();
            return;
          }
          const words = listData?.label?.split("_");

          // Capitalize each word and join them with a space
          const title = words
            .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
            .join(" ");
          editData.label = title;
        }
      });

    return metadata;
  },
});
