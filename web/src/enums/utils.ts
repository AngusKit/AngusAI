import { EnumMessage } from '@xcan-angus/infra';
import { enumNamespaceMap } from '@/enums/enums.ts';
import { getNestedTranslation, defaultLanguage } from '@/lib/i18n.ts';
import { enumTranslations as zhCNEnumTranslations } from '@/enums/locale/zh-CN.ts';
import { enumTranslations as enUSEnumTranslations } from '@/enums/locale/en-US.ts';


const enumTranslate = (path: string) => {
    const language = localStorage.getItem('language') || defaultLanguage;
    if (language === 'zh-CN') {
        return getNestedTranslation({enum: zhCNEnumTranslations}, path);
    } else {
        return getNestedTranslation({enum: enUSEnumTranslations}, path);
    }
};

export function mergeMaps(...appEnums: Map<any, string>[]): void {
    appEnums.forEach(map => {
        map.forEach((value, key) => enumNamespaceMap.set(key, value));
    });
};

/**
 * Gets the internationalized description for an enum value
 * @param enumType - The enum type
 * @param value - The enum value
 * @returns The internationalized description string
 */
export function getEnumDescription<T extends string>(
    enumType: any,
    value: T
): string {
    const namespace = enumNamespaceMap.get(enumType);
    if (!namespace) {
        return enumTranslate(value);
    }

    const translationKey = `${namespace}.${value}`;
    return enumTranslate(translationKey) || value;
};

/**
 * Converts an enum to an array of EnumMessage objects with internationalized descriptions
 * @param enumType - The enum type to convert
 * @param excludeValues - Optional array of values to exclude from the result
 * @returns Array of EnumMessage objects
 */
export function enumToMessages<T extends string>(
    enumType: any,
    excludeValues?: T[]
): EnumMessage<T>[] {
    const values = Object.values(enumType) as T[];
    const filteredValues = excludeValues 
        ? values.filter(value => !excludeValues.includes(value)) 
        : values;
    return filteredValues.map(value => ({
        value,
        message: getEnumDescription(enumType, value)
    }));
}

/**
 * Converts an enum to a Map where key is enum value and value is i18n message
 * @param enumType - The enum type to convert
 * @param excludeValues - Optional array of values to exclude from the result
 * @returns Map of enum value to i18n message
 */
export function enumToMap<T extends string>(
    enumType: any,
    excludeValues?: T[]
): Map<T, string> {
    const map = new Map<T, string>();
    const values = Object.values(enumType) as T[];
    const filteredValues = excludeValues
        ? values.filter(value => !excludeValues.includes(value))
        : values;
    filteredValues.forEach((value) => {
        map.set(value as T, getEnumDescription(enumType, value));
    });
    return map;
}

/**
 * Checks if a value is a valid member of the specified enum
 * @param enumType - The enum type to check against
 * @param value - The value to check
 * @returns True if the value is a valid enum member, false otherwise
 */
export function isEnumValue<T extends string>(
    enumType: any,
    value: T | string
): value is T {
    return Object.values(enumType).includes(value);
}

/**
 * Gets all values of an enum as an array
 * @param enumType - The enum type
 * @param excludeValues - Optional array of values to exclude from the result
 * @returns Array of enum values
 */
export function getEnumValues<T extends string>(
    enumType: any,
    excludeValues?: T[]): T[] {
    const values = Object.values(enumType) as T[];
    return excludeValues
        ? values.filter(value => !excludeValues.includes(value))
        : values;
}

/**
 * Gets the i18n namespace for an enum type
 * @param enumType - The enum type
 * @returns The i18n namespace string or undefined if not found
 */
export function getEnumNamespace(enumType: any): string | undefined {
    return enumNamespaceMap.get(enumType);
}

export default {
    enumNamespaceMap,
    mergeMaps,
    getEnumDescription,
    enumToMessages,
    enumToMap,
    isEnumValue,
    getEnumValues,
    getEnumNamespace
};