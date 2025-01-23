import Button from "#/Button";
import Head from "next/head";

import { ButtonProps } from "@/types/buttonTypes";

export default function NewRefaction({
  handleButton1,
  handleButton2,
}: ButtonProps) {
  return (
    <>
      <Head>
        <title>Tipo de Solicitud</title>
        <meta name="description" content="Camher" />
      </Head>
      <div className="flex flex-col items-center justify-center gap-10 mt-20">
        <h1 className="text-5xl self-center">Tipo de operación</h1>
        <h2 className="text-2xl self-center">
          Consigue la refacción que necesita <br /> 
          a partir de fallas en unidad <br /> 
          o reposición en almacén
        </h2>
        <Button onClick={handleButton1} intent={"regular"}>
          Reportar falla en unidad y solicitar refacción
        </Button>
        <Button onClick={handleButton2} intent={"regular"}>
          Reportar una reposición de refacción en el almacén
        </Button>
      </div>
    </>
  );
}
