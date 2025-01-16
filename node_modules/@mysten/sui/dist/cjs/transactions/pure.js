"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);
var pure_exports = {};
__export(pure_exports, {
  createPure: () => createPure
});
module.exports = __toCommonJS(pure_exports);
var import_bcs = require("@mysten/bcs");
var import_bcs2 = require("../bcs/index.js");
function createPure(makePure) {
  function pure(typeOrSerializedValue, value) {
    if (typeof typeOrSerializedValue === "string") {
      return makePure(schemaFromName(typeOrSerializedValue).serialize(value));
    }
    if (typeOrSerializedValue instanceof Uint8Array || (0, import_bcs.isSerializedBcs)(typeOrSerializedValue)) {
      return makePure(typeOrSerializedValue);
    }
    throw new Error("tx.pure must be called either a bcs type name, or a serialized bcs value");
  }
  pure.u8 = (value) => makePure(import_bcs2.bcs.U8.serialize(value));
  pure.u16 = (value) => makePure(import_bcs2.bcs.U16.serialize(value));
  pure.u32 = (value) => makePure(import_bcs2.bcs.U32.serialize(value));
  pure.u64 = (value) => makePure(import_bcs2.bcs.U64.serialize(value));
  pure.u128 = (value) => makePure(import_bcs2.bcs.U128.serialize(value));
  pure.u256 = (value) => makePure(import_bcs2.bcs.U256.serialize(value));
  pure.bool = (value) => makePure(import_bcs2.bcs.Bool.serialize(value));
  pure.string = (value) => makePure(import_bcs2.bcs.String.serialize(value));
  pure.address = (value) => makePure(import_bcs2.bcs.Address.serialize(value));
  pure.id = pure.address;
  pure.vector = (type, value) => {
    return makePure(import_bcs2.bcs.vector(schemaFromName(type)).serialize(value));
  };
  pure.option = (type, value) => {
    return makePure(import_bcs2.bcs.option(schemaFromName(type)).serialize(value));
  };
  return pure;
}
function schemaFromName(name) {
  switch (name) {
    case "u8":
      return import_bcs2.bcs.u8();
    case "u16":
      return import_bcs2.bcs.u16();
    case "u32":
      return import_bcs2.bcs.u32();
    case "u64":
      return import_bcs2.bcs.u64();
    case "u128":
      return import_bcs2.bcs.u128();
    case "u256":
      return import_bcs2.bcs.u256();
    case "bool":
      return import_bcs2.bcs.bool();
    case "string":
      return import_bcs2.bcs.string();
    case "id":
    case "address":
      return import_bcs2.bcs.Address;
  }
  const generic = name.match(/^(vector|option)<(.+)>$/);
  if (generic) {
    const [kind, inner] = generic.slice(1);
    if (kind === "vector") {
      return import_bcs2.bcs.vector(schemaFromName(inner));
    } else {
      return import_bcs2.bcs.option(schemaFromName(inner));
    }
  }
  throw new Error(`Invalid Pure type name: ${name}`);
}
//# sourceMappingURL=pure.js.map
