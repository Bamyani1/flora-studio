import type { StructureResolver } from "sanity/structure";

function singletonItem(
  S: Parameters<StructureResolver>[0],
  title: string,
  schemaType: string,
  documentId: string,
) {
  return S.listItem()
    .title(title)
    .id(documentId)
    .child(S.editor().id(documentId).schemaType(schemaType).documentId(documentId));
}

export const studioStructure: StructureResolver = (S) =>
  S.list()
    .title("Content")
    .items([
      singletonItem(S, "Site Settings", "siteSettings", "siteSettings"),
      singletonItem(S, "Home Page", "homePage", "homePage"),
      singletonItem(S, "About Page", "aboutPage", "aboutPage"),
      singletonItem(S, "Process Page", "processPage", "processPage"),
      singletonItem(S, "Contact Page", "contactPage", "contactPage"),
      S.divider(),
      S.documentTypeListItem("album").title("Albums"),
    ]);
