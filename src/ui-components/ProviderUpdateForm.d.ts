/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { Provider } from "../graphql/API.ts";
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
export declare type ProviderUpdateFormInputValues = {
    emails?: string[];
    name?: string;
};
export declare type ProviderUpdateFormValidationValues = {
    emails?: ValidationFunction<string>;
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type ProviderUpdateFormOverridesProps = {
    ProviderUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    emails?: PrimitiveOverrideProps<TextFieldProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type ProviderUpdateFormProps = React.PropsWithChildren<{
    overrides?: ProviderUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    provider?: Provider;
    onSubmit?: (fields: ProviderUpdateFormInputValues) => ProviderUpdateFormInputValues;
    onSuccess?: (fields: ProviderUpdateFormInputValues) => void;
    onError?: (fields: ProviderUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: ProviderUpdateFormInputValues) => ProviderUpdateFormInputValues;
    onValidate?: ProviderUpdateFormValidationValues;
} & React.CSSProperties>;
export default function ProviderUpdateForm(props: ProviderUpdateFormProps): React.ReactElement;
