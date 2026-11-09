export interface JsonToTypescriptOptions {
  rootName?: string;
  outputMode?: "interface" | "type" | "zod";
  useExport?: boolean;
  useReadonly?: boolean;
  useOptional?: boolean;
  arrayStyle?: "bracket" | "generic";
}

export interface JsonToTypescriptResult {
  code: string;
  error?: string;
  interfaceCount: number;
}

function toPascalCase(str: string): string {
  if (!str) return "Type";
  const cleaned = str.replace(/[^a-zA-Z0-9_$]/g, " ");
  const parts = cleaned.split(/\s+/).filter(Boolean);
  if (parts.length === 0) return "Type";
  return parts
    .map((p) => p.charAt(0).toUpperCase() + p.slice(1))
    .join("");
}

function isValidIdentifier(name: string): boolean {
  return /^[a-zA-Z_$][a-zA-Z0-9_$]*$/.test(name);
}

function formatKey(key: string): string {
  return isValidIdentifier(key) ? key : JSON.stringify(key);
}

function singularize(name: string): string {
  if (name.endsWith("ies") && name.length > 3) {
    return name.slice(0, -3) + "y";
  }
  if (name.endsWith("es") && name.length > 3 && /(s|x|z|ch|sh)es$/.test(name)) {
    return name.slice(0, -2);
  }
  if (name.endsWith("s") && name.length > 1 && !name.endsWith("ss")) {
    return name.slice(0, -1);
  }
  return name;
}

interface TypeDefinition {
  name: string;
  properties: {
    key: string;
    typeStr: string;
    optional: boolean;
    readonly: boolean;
    zodStr: string;
  }[];
}

export function convertJsonToTypescript(
  jsonString: string,
  options: JsonToTypescriptOptions = {}
): JsonToTypescriptResult {
  const {
    rootName = "RootObject",
    outputMode = "interface",
    useExport = true,
    useReadonly = false,
    useOptional = false,
    arrayStyle = "bracket",
  } = options;

  const trimmed = jsonString.trim();
  if (!trimmed) {
    return { code: "", interfaceCount: 0 };
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed);
  } catch (err) {
    return {
      code: "",
      error: err instanceof Error ? err.message : "Invalid JSON syntax",
      interfaceCount: 0,
    };
  }

  const sanitizedRootName = toPascalCase(rootName) || "RootObject";
  const definedTypes: TypeDefinition[] = [];
  const generatedNames = new Set<string>();

  function getUniqueTypeName(baseName: string): string {
    let candidate = toPascalCase(baseName) || "Item";
    let counter = 2;
    while (generatedNames.has(candidate)) {
      candidate = `${toPascalCase(baseName)}${counter}`;
      counter++;
    }
    generatedNames.add(candidate);
    return candidate;
  }

  function resolveType(
    value: unknown,
    keyHint: string
  ): { tsType: string; zodType: string } {
    if (value === null) {
      return { tsType: "null", zodType: "z.null()" };
    }
    if (value === undefined) {
      return { tsType: "undefined", zodType: "z.undefined()" };
    }

    const valType = typeof value;
    if (valType === "string") {
      // Check for ISO Date format
      const isIsoDate = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d+)?(?:Z|[+-]\d{2}:\d{2})?$/.test(
        value as string
      );
      if (isIsoDate) {
        return { tsType: "string", zodType: "z.string().datetime()" };
      }
      return { tsType: "string", zodType: "z.string()" };
    }
    if (valType === "number") {
      return { tsType: "number", zodType: "z.number()" };
    }
    if (valType === "boolean") {
      return { tsType: "boolean", zodType: "z.boolean()" };
    }

    if (Array.isArray(value)) {
      if (value.length === 0) {
        const itemType = "unknown";
        const tsArray = arrayStyle === "generic" ? `Array<${itemType}>` : `${itemType}[]`;
        return { tsType: tsArray, zodType: "z.array(z.unknown())" };
      }

      // Check if array of objects
      const objects = value.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      );

      if (objects.length > 0) {
        const singularHint = singularize(keyHint);
        const childTypeName = getUniqueTypeName(singularHint);
        extractMergedObjectType(objects, childTypeName);

        const tsArray =
          arrayStyle === "generic" ? `Array<${childTypeName}>` : `${childTypeName}[]`;
        const zodArray = `z.array(${toCamelCase(childTypeName)}Schema)`;
        return { tsType: tsArray, zodType: zodArray };
      }

      // Array of primitives or mixed
      const primitiveTypes = new Set<string>();
      const primitiveZod = new Set<string>();
      for (const item of value) {
        const res = resolveType(item, `${keyHint}Item`);
        primitiveTypes.add(res.tsType);
        primitiveZod.add(res.zodType);
      }

      const unionTs = Array.from(primitiveTypes).join(" | ");
      const wrappedTs = primitiveTypes.size > 1 ? `(${unionTs})` : unionTs;
      const tsArray =
        arrayStyle === "generic" ? `Array<${unionTs}>` : `${wrappedTs}[]`;

      let zodElem = Array.from(primitiveZod)[0] || "z.unknown()";
      if (primitiveZod.size > 1) {
        zodElem = `z.union([${Array.from(primitiveZod).join(", ")}])`;
      }
      return { tsType: tsArray, zodType: `z.array(${zodElem})` };
    }

    if (typeof value === "object") {
      const childTypeName = getUniqueTypeName(keyHint);
      extractObjectType(value as Record<string, unknown>, childTypeName);
      return {
        tsType: childTypeName,
        zodType: `${toCamelCase(childTypeName)}Schema`,
      };
    }

    return { tsType: "unknown", zodType: "z.unknown()" };
  }

  function toCamelCase(str: string): string {
    const pascal = toPascalCase(str);
    return pascal.charAt(0).toLowerCase() + pascal.slice(1);
  }

  function extractObjectType(
    obj: Record<string, unknown>,
    typeName: string
  ): void {
    const properties: TypeDefinition["properties"] = [];

    for (const [key, val] of Object.entries(obj)) {
      const isNull = val === null;
      const { tsType, zodType } = resolveType(val, key);

      let finalTsType = tsType;
      let finalZodType = zodType;

      if (isNull) {
        finalTsType = "string | null";
        finalZodType = "z.string().nullable()";
      }

      properties.push({
        key,
        typeStr: finalTsType,
        optional: useOptional,
        readonly: useReadonly,
        zodStr: useOptional ? `${finalZodType}.optional()` : finalZodType,
      });
    }

    definedTypes.push({ name: typeName, properties });
  }

  function extractMergedObjectType(
    objects: Record<string, unknown>[],
    typeName: string
  ): void {
    const allKeys = new Map<string, unknown[]>();

    for (const obj of objects) {
      for (const [k, v] of Object.entries(obj)) {
        if (!allKeys.has(k)) {
          allKeys.set(k, []);
        }
        allKeys.get(k)!.push(v);
      }
    }

    const properties: TypeDefinition["properties"] = [];

    for (const [key, values] of allKeys.entries()) {
      const isPresentInAll = values.length === objects.length;
      const isOptional = useOptional || !isPresentInAll;

      // Sample first non-null value if possible
      const nonNullValue = values.find((v) => v !== null && v !== undefined);
      const sample = nonNullValue !== undefined ? nonNullValue : values[0];
      const hasNull = values.some((v) => v === null);

      const { tsType, zodType } = resolveType(sample, key);

      let finalTsType = tsType;
      let finalZodType = zodType;

      if (hasNull && finalTsType !== "null") {
        finalTsType = `${finalTsType} | null`;
        finalZodType = `${finalZodType}.nullable()`;
      }

      properties.push({
        key,
        typeStr: finalTsType,
        optional: isOptional,
        readonly: useReadonly,
        zodStr: isOptional ? `${finalZodType}.optional()` : finalZodType,
      });
    }

    definedTypes.push({ name: typeName, properties });
  }

  // Handle Root Type
  if (Array.isArray(parsed)) {
    if (parsed.length > 0 && typeof parsed[0] === "object" && parsed[0] !== null) {
      const singularRoot = singularize(sanitizedRootName);
      generatedNames.add(singularRoot);
      const objects = parsed.filter(
        (item): item is Record<string, unknown> =>
          item !== null && typeof item === "object" && !Array.isArray(item)
      );
      extractMergedObjectType(objects, singularRoot);

      // Root alias pointing to array
      const exportPrefix = useExport ? "export " : "";
      const rootArrayTs =
        arrayStyle === "generic" ? `Array<${singularRoot}>` : `${singularRoot}[]`;

      let outputCode = "";
      if (outputMode === "zod") {
        outputCode = `import { z } from "zod";\n\n`;
        for (const t of definedTypes) {
          const schemaName = `${toCamelCase(t.name)}Schema`;
          outputCode += `${exportPrefix}const ${schemaName} = z.object({\n`;
          for (const prop of t.properties) {
            outputCode += `  ${formatKey(prop.key)}: ${prop.zodStr},\n`;
          }
          outputCode += `});\n`;
          outputCode += `${exportPrefix}type ${t.name} = z.infer<typeof ${schemaName}>;\n\n`;
        }
        outputCode += `${exportPrefix}const ${toCamelCase(sanitizedRootName)}Schema = z.array(${toCamelCase(singularRoot)}Schema);\n`;
        outputCode += `${exportPrefix}type ${sanitizedRootName} = z.infer<typeof ${toCamelCase(sanitizedRootName)}Schema>;\n`;
      } else if (outputMode === "type") {
        for (const t of definedTypes) {
          outputCode += `${exportPrefix}type ${t.name} = {\n`;
          for (const prop of t.properties) {
            const ro = prop.readonly ? "readonly " : "";
            const opt = prop.optional ? "?" : "";
            outputCode += `  ${ro}${formatKey(prop.key)}${opt}: ${prop.typeStr};\n`;
          }
          outputCode += `};\n\n`;
        }
        outputCode += `${exportPrefix}type ${sanitizedRootName} = ${rootArrayTs};\n`;
      } else {
        // Interface mode
        for (const t of definedTypes) {
          outputCode += `${exportPrefix}interface ${t.name} {\n`;
          for (const prop of t.properties) {
            const ro = prop.readonly ? "readonly " : "";
            const opt = prop.optional ? "?" : "";
            outputCode += `  ${ro}${formatKey(prop.key)}${opt}: ${prop.typeStr};\n`;
          }
          outputCode += `}\n\n`;
        }
        outputCode += `${exportPrefix}type ${sanitizedRootName} = ${rootArrayTs};\n`;
      }

      return {
        code: outputCode.trim(),
        interfaceCount: definedTypes.length + 1,
      };
    } else {
      // Primitive array root
      const { tsType, zodType } = resolveType(parsed[0] ?? "unknown", "Item");
      const exportPrefix = useExport ? "export " : "";
      const rootArrayTs = arrayStyle === "generic" ? `Array<${tsType}>` : `${tsType}[]`;

      let code = "";
      if (outputMode === "zod") {
        code = `import { z } from "zod";\n\n${exportPrefix}const ${toCamelCase(sanitizedRootName)}Schema = z.array(${zodType});\n${exportPrefix}type ${sanitizedRootName} = z.infer<typeof ${toCamelCase(sanitizedRootName)}Schema>;`;
      } else {
        code = `${exportPrefix}type ${sanitizedRootName} = ${rootArrayTs};`;
      }
      return { code, interfaceCount: 1 };
    }
  } else if (typeof parsed === "object" && parsed !== null) {
    generatedNames.add(sanitizedRootName);
    extractObjectType(parsed as Record<string, unknown>, sanitizedRootName);

    // Format output
    const exportPrefix = useExport ? "export " : "";
    let outputCode = "";

    if (outputMode === "zod") {
      outputCode = `import { z } from "zod";\n\n`;
      // Render children first, root last
      for (const t of definedTypes) {
        const schemaName = `${toCamelCase(t.name)}Schema`;
        outputCode += `${exportPrefix}const ${schemaName} = z.object({\n`;
        for (const prop of t.properties) {
          outputCode += `  ${formatKey(prop.key)}: ${prop.zodStr},\n`;
        }
        outputCode += `});\n`;
        outputCode += `${exportPrefix}type ${t.name} = z.infer<typeof ${schemaName}>;\n\n`;
      }
    } else if (outputMode === "type") {
      for (const t of definedTypes) {
        outputCode += `${exportPrefix}type ${t.name} = {\n`;
        for (const prop of t.properties) {
          const ro = prop.readonly ? "readonly " : "";
          const opt = prop.optional ? "?" : "";
          outputCode += `  ${ro}${formatKey(prop.key)}${opt}: ${prop.typeStr};\n`;
        }
        outputCode += `};\n\n`;
      }
    } else {
      // Interface mode
      for (const t of definedTypes) {
        outputCode += `${exportPrefix}interface ${t.name} {\n`;
        for (const prop of t.properties) {
          const ro = prop.readonly ? "readonly " : "";
          const opt = prop.optional ? "?" : "";
          outputCode += `  ${ro}${formatKey(prop.key)}${opt}: ${prop.typeStr};\n`;
        }
        outputCode += `}\n\n`;
      }
    }

    return {
      code: outputCode.trim(),
      interfaceCount: definedTypes.length,
    };
  } else {
    // Primitive root
    const valType = typeof parsed;
    const exportPrefix = useExport ? "export " : "";
    return {
      code: `${exportPrefix}type ${sanitizedRootName} = ${valType};`,
      interfaceCount: 1,
    };
  }
}
