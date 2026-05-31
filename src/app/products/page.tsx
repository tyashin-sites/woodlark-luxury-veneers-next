import { redirect } from 'next/navigation';

// /products is canonical on the Tyashin platform; Woodlark uses /collection.
// Redirect for both SEO and any platform-emitted internal links.
export default function ProductsRedirect() {
  redirect('/collection');
}
