import type { FileInfo, API, Options } from "jscodeshift";

export default function transform(
  file: FileInfo,
  api: API,
  options?: Options
): string | undefined {
  const j = api.jscodeshift;
  const root = j(file.source);

  // Find all JSXElements with name 'CustomButton'
  root
    .find(j.JSXElement, {
      openingElement: {
        name: {
          type: "JSXIdentifier",
          name: "CustomButton",
        },
      },
    })
    .forEach((path) => {
      const variantAttribute = path.value.openingElement.attributes.find(
        (attr) => {
          return (
            attr.type === "JSXAttribute" &&
            attr.name.type === "JSXIdentifier" &&
            attr.name.name === "variant"
          );
        }
      );

      if (variantAttribute && variantAttribute.value) {
        if (variantAttribute.value.value === "primary") {
          variantAttribute.value.value = "default";
        } else if (variantAttribute.value.value === "default") {
          variantAttribute.value.value = "primary";
        }
      }
    });

  return root.toSource();
}
