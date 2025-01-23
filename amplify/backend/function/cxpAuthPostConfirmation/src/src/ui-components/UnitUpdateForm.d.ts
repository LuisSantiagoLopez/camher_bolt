/***************************************************************************
 * The contents of this file were generated with Amplify Studio.           *
 * Please refrain from making any modifications to this file.              *
 * Any changes to this file will be overwritten when running amplify pull. *
 **************************************************************************/

import * as React from "react";
import { GridProps, TextFieldProps } from "@aws-amplify/ui-react";
import { EscapeHatchProps } from "@aws-amplify/ui-react/internal";
import { Unit } from "../models";
export declare type ValidationResponse = {
    hasError: boolean;
    errorMessage?: string;
};
export declare type ValidationFunction<T> = (value: T, validationResponse: ValidationResponse) => ValidationResponse | Promise<ValidationResponse>;
export declare type UnitUpdateFormInputValues = {
    name?: string;
};
export declare type UnitUpdateFormValidationValues = {
    name?: ValidationFunction<string>;
};
export declare type PrimitiveOverrideProps<T> = Partial<T> & React.DOMAttributes<HTMLDivElement>;
export declare type UnitUpdateFormOverridesProps = {
    UnitUpdateFormGrid?: PrimitiveOverrideProps<GridProps>;
    name?: PrimitiveOverrideProps<TextFieldProps>;
} & EscapeHatchProps;
export declare type UnitUpdateFormProps = React.PropsWithChildren<{
    overrides?: UnitUpdateFormOverridesProps | undefined | null;
} & {
    id?: string;
    unit?: Unit;
    onSubmit?: (fields: UnitUpdateFormInputValues) => UnitUpdateFormInputValues;
    onSuccess?: (fields: UnitUpdateFormInputValues) => void;
    onError?: (fields: UnitUpdateFormInputValues, errorMessage: string) => void;
    onChange?: (fields: UnitUpdateFormInputValues) => UnitUpdateFormInputValues;
    onValidate?: UnitUpdateFormValidationValues;
} & React.CSSProperties>;
export default function UnitUpdateForm(props: UnitUpdateFormProps): React.ReactElement;
