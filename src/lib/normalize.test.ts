import { normalize } from "./normalize";

describe("normalize", () => {
  it("lower-cases", () => {
    expect(normalize("Dashboard")).toBe("dashboard");
  });

  it("strips diacritics so unaccented input matches accented text", () => {
    expect(normalize("Compañía")).toBe("compania");
    expect(normalize("Facturación Electrónica")).toBe("facturacion electronica");
    expect(normalize("Configuración").includes(normalize("configuracion"))).toBe(
      true,
    );
  });

  it("leaves plain text and digits untouched", () => {
    expect(normalize("e-CF 31")).toBe("e-cf 31");
    expect(normalize("")).toBe("");
  });
});
