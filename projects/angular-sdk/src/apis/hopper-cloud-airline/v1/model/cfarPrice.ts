/**
 * Airline API
 * No description provided (generated by Swagger Codegen https://github.com/swagger-api/swagger-codegen)
 *
 * OpenAPI spec version: v1.1
 * 
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { AncillaryType } from './ancillaryType';
import { CfarPriceType } from './cfarPriceType';
import { PassengerType } from './passengerType';

export interface CfarPrice { 
    passengerType?: PassengerType;
    nbPax?: number;
    coverage: string;
    premium: string;
    ancillaryType?: AncillaryType;
    passengerReference?: string;
    cfarPriceType: CfarPriceType;
}