import { Component, Inject, OnChanges, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { take } from 'rxjs/operators';
import { CfarContractCustomer, CfarItinerary, CfarOfferCustomer, CreateCfarContractCustomerRequest, CreateCfarOfferCustomerRequest, RequestType, UiSource, UiVariant } from '../../apis/hopper-cloud-airline/v1';
import { TranslateService } from '@ngx-translate/core';
import { DateAdapter } from "@angular/material/core";
import { GlobalComponent } from '../global.component';
import { ApiTranslatorUtils } from '../../utils/api-translator.utils';
import { HopperCfarService } from '../../services/hopper-cfar.service';
import { HopperEventsService } from '../../services/hopper-events.service';

@Component({
  selector: 'hopper-cfar-offer-dialog',
  templateUrl: './cfar-offer-dialog.component.html',
  styleUrls: ['./cfar-offer-dialog.component.scss']
})
export class CfarOfferDialogComponent extends GlobalComponent implements OnInit, OnChanges {

  public cfarOffers!: CfarOfferCustomer[];
  public selectedCfarOffer!: CfarOfferCustomer;
  public isLoading!: boolean;
  public errorCode?: string;

  private _hCSessionId!: string;
  private _itineraries!: CfarItinerary[];

  constructor(
    private _adapter: DateAdapter<any>,
    private _translateService: TranslateService,
    private _dialogRef: MatDialogRef<CfarOfferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private _hopperCfarService: HopperCfarService,
    private _hopperEventService: HopperEventsService
  ) {
    super(_adapter, _translateService);

    // Mandatory data
    this._hCSessionId = data.hCSessionId;

    // Optional data
    this._itineraries = data.itineraries;
    this.cfarOffers = data.cfarOffers;

    // Update parents @inputs manually (Dialog limitation)
    this.isFakeBackend = data.isFakeBackend;
    this.currentLang = data.currentLang;
    this.basePath = data.basePath;
  }

  // -----------------------------------------------
  // Life Cycle Hooks
  // -----------------------------------------------

  ngOnInit(): void {
    // Update languages/labels manually (dialog limitation)
    this._updateLanguage(this.currentLang);

    if (this.isFakeBackend) {
      this.cfarOffers = this._buildFakePostCfarOffersResponse();
      this.selectedCfarOffer = this._getCheapestOffer(this.cfarOffers);
    } else if (this.cfarOffers && this.cfarOffers?.length > 0) {
      this.selectedCfarOffer = this._getCheapestOffer(this.cfarOffers);
    } else {
      this.initCfarOffers();      
    }
  }

  // -----------------------------------------------
  // Publics Methods
  // -----------------------------------------------

  public onClose(): void {
    //Create an event
    this.createDenyPurchaseEvent();
    // Close the window
    this._dialogRef.close();
  }

  public onSubmit(): void {
    this.isLoading = true;

    // Create CFAR Contract
    this._hopperCfarService
      .postCfarContracts(this.basePath, this._hCSessionId, ApiTranslatorUtils.modelToSnakeCase(this._buildCreateCfarContractRequest()))
      .pipe(take(1))
      .subscribe({
        next: (cfarContract: CfarContractCustomer) => {
          this._dialogRef.close(ApiTranslatorUtils.modelToCamelCase(cfarContract) as CfarContractCustomer);
        },
        error: (error) => {
          const builtError = this._getHcAirlinesErrorResponse(error);
          this.errorCode = builtError.code;
          
          this.isLoading = false;
        }
      });
  }

  public onSelectOffer(cfarOffer: CfarOfferCustomer): void {
    this.selectedCfarOffer = cfarOffer;
  }

  public onOpenTermsAndConditions(): void {
    this.createTermsAndConditionsEvent();
  }

  public computePercentage(offer: CfarOfferCustomer): number {
    if (offer) {
      const coverage = Number.parseFloat(offer.coverage);
      const totalPrice = Number.parseFloat(offer.itinerary.totalPrice);
  
      return coverage / (totalPrice || 1.0);
    }

    return 0;
  }

  public getPricePerTraveler(offer: CfarOfferCustomer): number {
    var nbTravelers = 0;
    
    offer.itinerary.passengerPricing.forEach(pp => {
      nbTravelers += pp.passengerCount.count
    });

    return +offer.premium / (nbTravelers || 1);
  }

  // -----------------------------------------------
  // Protected Methods
  // -----------------------------------------------

  protected initCfarOffers(): void {
    this.isLoading = true;
    
    this._hopperCfarService
    .postCfarOffers(this.basePath, this._hCSessionId, ApiTranslatorUtils.modelToSnakeCase(this._buildCreateCfarOfferRequest()))
    .pipe(take(1))
    .subscribe({
      next: (cfarOffers) => {
        let results: CfarOfferCustomer[] = [];

        if (cfarOffers) {
          cfarOffers.forEach(cfarOffer => {
            results.push(ApiTranslatorUtils.modelToCamelCase(cfarOffer) as CfarOfferCustomer);
          });
        }
        
        this.cfarOffers = results;
        // The cheapest by default
        this.selectedCfarOffer = this._getCheapestOffer(this.cfarOffers);
        this.isLoading = false;

        // Build corresponding events
        this.createEventsAfterInit();
      },
      error: (error) => {
        const builtError = this._getHcAirlinesErrorResponse(error);
        this.errorCode = builtError.code;

        this.isLoading = false;
      }
    });
  }

  protected createEventsAfterInit(): void {
    if (this.isFakeBackend) {
      return;
    }
    this._hopperEventService
      .postCreateCfarOffersTakeoverDisplay(this.basePath, this._hCSessionId)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error(error);
        }
      });
  }
  
  protected createTermsAndConditionsEvent(): void {
    if (this.isFakeBackend) {
      return;
    }
    this._hopperEventService
      .postCreateCfarViewInfo(this.basePath, this._hCSessionId, UiSource.Takeover)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error(error);
        }
      });
  }
  
  protected createDenyPurchaseEvent(): void {
    if (this.isFakeBackend) {
      return;
    }
    this._hopperEventService
      .postCreateCfarDenyPurchase(this.basePath, this._hCSessionId, UiSource.Takeover)
      .pipe(take(1))
      .subscribe({
        next: () => {},
        error: (error) => {
          console.error(error);
        }
      });
  }

  // -----------------------------------------------
  // Privates Methods
  // -----------------------------------------------

  private _buildCreateCfarOfferRequest(): CreateCfarOfferCustomerRequest {
    return {
      itinerary: this._itineraries,
      requestType: RequestType.Ancillary
    };
  }

  private _buildCreateCfarContractRequest(): CreateCfarContractCustomerRequest {
    return {
      offerIds: [this.selectedCfarOffer.id],
      itinerary: this.selectedCfarOffer.itinerary,
      uiSource: UiSource.Takeover
    };
  } 

  private _buildFakePostCfarOffersResponse(): CfarOfferCustomer[] {
    return [
      {
        id: "1ecf859e-8785-625f-8eda-198d1ce0d6c4",
        premium: "8.00",
        coverage: "57.78",
        currency: "CAD",
        requestType: "ancillary",
        toUsdExchangeRate: "0.7744877537996369201410187302118379",
        contractExpiryDateTime: new Date("2022-07-08T22:00:00Z"),
        createdDateTime: new Date("2022-06-30T09:49:17.762Z"),
        itinerary: {
          passengerPricing: [
            {
              passengerCount: {
                  count: 3,
                  type: "adult"
              },
              individualPrice: "null"
            }
          ],
          "currency": "CAD",
          slices: [
            {
              segments: [
                {
                  originAirport: "YYZ",
                  destinationAirport: "YUL",
                  departureDateTime: "2022-07-09T18:00",
                  arrivalDateTime: "2022-07-09T19:14",
                  flightNumber: "AC894",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                },
                {
                  originAirport: "YUL",
                  destinationAirport: "NCE",
                  departureDateTime: "2022-07-09T20:50",
                  arrivalDateTime: "2022-07-10T10:25",
                  flightNumber: "AC878",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                }
              ]
            },
            {
              segments: [
                {
                  originAirport: "NCE",
                  destinationAirport: "YUL",
                  departureDateTime: "2022-07-15T13:15",
                  arrivalDateTime: "2022-07-15T15:55",
                  flightNumber: "AC879",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                },
                {
                  originAirport: "YUL",
                  destinationAirport: "YYZ",
                  departureDateTime: "2022-07-15T17:30",
                  arrivalDateTime: "2022-07-15T18:50",
                  flightNumber: "AC895",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                }
              ]
            }
          ],
          ancillaries: [],
          totalPrice: "71.96"
        },
        offerDescription: {
          "en": [
            "Add the flexibility to cancel your flight for any reason up to <b> 24 hours </b> before departure",
            "Cancel and get a refund of your flight base fare and taxes, excluding additional services (paid seats, paid bags...)",
            "Get instant resolution, no forms or claims required"
          ],
          "fr": [
            "Offrez-vous la flexibilité d'une annulation sans aucune justification jusqu'à <b>24 heures</b> avant le départ",
            "Annulez et recevez un rembousement du prix de votre vol avec les taxes, à l'exclusion des services additionnels (sièges payant, bagages supplémentaires...)",
            "Traitement instantané, aucun formulaire ou dossier à remplir"
          ],
          "es": ["Date la flexibilidad de una cancelación sin justificación hasta <b>24 horas</b> antes de la salida",
            "Cancela y recibe un reembolso del precio de tu vuelo con impuestos, excluyendo servicios adicionales (asientos pagados, equipaje adicional, etc.)",
            "Procesamiento instantáneo, sin formularios ni archivos para completar"
          ],
          "zh": [
            "在出发前 <b>24 小时</b> 之前，让自己在没有任何理由的情况下灵活取消",
            "取消并获得含税的航班价格退款，不包括额外服务（付费座位、额外行李等）",
            "即时处理，无需填写表格或文件"
          ]
        }
      },
      {
        id: "1ecf859e-8785-625f-8eda-198d1ce0d6c5",
        premium: "10.00",
        coverage: "71.96",
        currency: "CAD",
        requestType: "ancillary",
        toUsdExchangeRate: "0.7744877537996369201410187302118379",
        contractExpiryDateTime: new Date("2022-07-08T22:00:00Z"),
        createdDateTime: new Date("2022-06-30T09:49:17.762Z"),
        itinerary: {
          passengerPricing: [
            {
              passengerCount: {
                  count: 3,
                  type: "adult"
              },
              individualPrice: "null"
            }
          ],
          currency: "CAD",
          slices: [
            {
              segments: [
                {
                  originAirport: "YYZ",
                  destinationAirport: "YUL",
                  departureDateTime: "2022-07-09T18:00",
                  arrivalDateTime: "2022-07-09T19:14",
                  flightNumber: "AC894",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                },
                {
                  originAirport: "YUL",
                  destinationAirport: "NCE",
                  departureDateTime: "2022-07-09T20:50",
                  arrivalDateTime: "2022-07-10T10:25",
                  flightNumber: "AC878",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                }
              ]
            },
            {
              segments: [
                {
                  originAirport: "NCE",
                  destinationAirport: "YUL",
                  departureDateTime: "2022-07-15T13:15",
                  arrivalDateTime: "2022-07-15T15:55",
                  flightNumber: "AC879",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                },
                {
                  originAirport: "YUL",
                  destinationAirport: "YYZ",
                  departureDateTime: "2022-07-15T17:30",
                  arrivalDateTime: "2022-07-15T18:50",
                  flightNumber: "AC895",
                  validatingCarrierCode: "AC",
                  fareClass: "economy"
                }
              ]
            }
          ],
          ancillaries: [],
          totalPrice: "71.96"
        },
        offerDescription: {
          "en": [
            "Add the flexibility to cancel your flight for any reason up to <b> 24 hours </b> before departure",
            "Cancel and get a refund of your flight base fare and taxes, excluding additional services (paid seats, paid bags...)",
            "Get instant resolution, no forms or claims required"
          ],
          "fr": [
            "Offrez-vous la flexibilité d'une annulation sans aucune justification jusqu'à <b>24 heures</b> avant le départ",
            "Annulez et recevez un rembousement du prix de votre vol avec les taxes, à l'exclusion des services additionnels (sièges payant, bagages supplémentaires...)",
            "Traitement instantané, aucun formulaire ou dossier à remplir"
          ],
          "es": ["Date la flexibilidad de una cancelación sin justificación hasta <b>24 horas</b> antes de la salida",
            "Cancela y recibe un reembolso del precio de tu vuelo con impuestos, excluyendo servicios adicionales (asientos pagados, equipaje adicional, etc.)",
            "Procesamiento instantáneo, sin formularios ni archivos para completar"
          ],
          "zh": [
            "在出发前 <b>24 小时</b> 之前，让自己在没有任何理由的情况下灵活取消",
            "取消并获得含税的航班价格退款，不包括额外服务（付费座位、额外行李等）",
            "即时处理，无需填写表格或文件"
          ]
        }
      }
    ];
  }
}
