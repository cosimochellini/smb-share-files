import { content } from "../../../src/services/content.service";
import { defaultBehavior } from "../../../src/utils/api/composable";

export default defaultBehavior(async function (req) {
  const { query } = req.query;

  const data = await content.findFirstContent(query as string);

  return data;
});
