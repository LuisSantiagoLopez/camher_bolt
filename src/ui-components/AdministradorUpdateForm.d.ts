/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Administrador } from "../graphql/API.ts";
export declare type EscapeHatchProps = {
    [elementHierarchy: string]: Record<string, unknown>;
} | null;
export declare type VariantValues = {
    [key: string]: string;
};
export declare type Variant = {
    variantValues: VariantValues;
    overrides: EscapeHatchProps;
};
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type AdministradorUpdateFormInputValues = {
    emails?: string[];
    name?: string;
    createdAt?: string;
    updatedAt?: string;
};
export declare type AdministradorUpdateFormValidationValues = {
    emails?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
    createdAt?: ValidationFunction<string>;
    updatedAt?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type AdministradorUpdateFormOverridesProps = {
    AdministradorUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    emails?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
    createdAt?: PrimitiveOverrideProps<TextFieldProps>;
    updatedAt?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type AdministradorUpdateFormProps = React.PropsWithChildren<{
    overrides?: AdministradorUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    administrador?: Administrador;
    onSubmit?: (fields: AdministradorUpdateFormInputValues) => AdministradorUpdateFormInputValues;
    onSuccess?: (fields: AdministradorUpdateFormInputValues) => void;
    onError?: (fields: AdministradorUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: AdministradorUpdateFormInputValues) => AdministradorUpdateFormInputValues;
    onValidate?: AdministradorUpdateFormValidationValues;
} & React.CSSProperties>;
export default function AdministradorUpdateForm(props: AdministradorUpdateFormProps): React.ReactElement;
