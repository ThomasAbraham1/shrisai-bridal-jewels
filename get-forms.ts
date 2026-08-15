import wixClient from './src/wixClient';

async function getForms() {
  try {
    const res = await wixClient.forms.queryForms().find();
    console.log(JSON.stringify(res.items, null, 2));
  } catch(e) {
    console.error(e);
  }
}
getForms();
