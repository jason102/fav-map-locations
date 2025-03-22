import { GraphQLResolveInfo } from 'graphql';
import { GraphQLContext } from '.';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
export type RequireFields<T, K extends keyof T> = Omit<T, K> & { [P in K]-?: NonNullable<T[P]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type Bounds = {
  neLat: Scalars['Float']['input'];
  neLng: Scalars['Float']['input'];
  swLat: Scalars['Float']['input'];
  swLng: Scalars['Float']['input'];
};

export type Place = {
  __typename?: 'Place';
  address: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  creatorUserId: Scalars['ID']['output'];
  id: Scalars['ID']['output'];
  lat: Scalars['Float']['output'];
  lng: Scalars['Float']['output'];
  name: Scalars['String']['output'];
};

export type PlaceDetails = {
  __typename?: 'PlaceDetails';
  averageRating: Scalars['Float']['output'];
  creatorUsername: Scalars['String']['output'];
  place: Place;
  userRating: Scalars['Float']['output'];
};

export type Query = {
  __typename?: 'Query';
  placeDetails?: Maybe<PlaceDetails>;
  userDetails?: Maybe<User>;
  visibleAreaPlaces: Array<Maybe<VisibleAreaPlaces>>;
};


export type QueryPlaceDetailsArgs = {
  id: Scalars['ID']['input'];
};


export type QueryUserDetailsArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


export type QueryVisibleAreaPlacesArgs = {
  bounds: Bounds;
};

export type User = {
  __typename?: 'User';
  email?: Maybe<Scalars['String']['output']>;
  memberSince?: Maybe<Scalars['String']['output']>;
  username?: Maybe<Scalars['String']['output']>;
};

export type VisibleAreaPlaces = {
  __typename?: 'VisibleAreaPlaces';
  averageRating: Scalars['Float']['output'];
  place: Place;
};

export type WithIndex<TObject> = TObject & Record<string, any>;
export type ResolversObject<TObject> = WithIndex<TObject>;

export type ResolverTypeWrapper<T> = Promise<T> | T;


export type ResolverWithResolve<TResult, TParent, TContext, TArgs> = {
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>;
};
export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> = ResolverFn<TResult, TParent, TContext, TArgs> | ResolverWithResolve<TResult, TParent, TContext, TArgs>;

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => Promise<TResult> | TResult;

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => AsyncIterable<TResult> | Promise<AsyncIterable<TResult>>;

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;

export interface SubscriptionSubscriberObject<TResult, TKey extends string, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<{ [key in TKey]: TResult }, TParent, TContext, TArgs>;
  resolve?: SubscriptionResolveFn<TResult, { [key in TKey]: TResult }, TContext, TArgs>;
}

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<any, TParent, TContext, TArgs>;
  resolve: SubscriptionResolveFn<TResult, any, TContext, TArgs>;
}

export type SubscriptionObject<TResult, TKey extends string, TParent, TContext, TArgs> =
  | SubscriptionSubscriberObject<TResult, TKey, TParent, TContext, TArgs>
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>;

export type SubscriptionResolver<TResult, TKey extends string, TParent = {}, TContext = {}, TArgs = {}> =
  | ((...args: any[]) => SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>)
  | SubscriptionObject<TResult, TKey, TParent, TContext, TArgs>;

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo
) => Maybe<TTypes> | Promise<Maybe<TTypes>>;

export type IsTypeOfResolverFn<T = {}, TContext = {}> = (obj: T, context: TContext, info: GraphQLResolveInfo) => boolean | Promise<boolean>;

export type NextResolverFn<T> = () => Promise<T>;

export type DirectiveResolverFn<TResult = {}, TParent = {}, TContext = {}, TArgs = {}> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo
) => TResult | Promise<TResult>;



/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = ResolversObject<{
  Boolean: ResolverTypeWrapper<Scalars['Boolean']['output']>;
  Bounds: Bounds;
  Float: ResolverTypeWrapper<Scalars['Float']['output']>;
  ID: ResolverTypeWrapper<Scalars['ID']['output']>;
  Place: ResolverTypeWrapper<Place>;
  PlaceDetails: ResolverTypeWrapper<PlaceDetails>;
  Query: ResolverTypeWrapper<{}>;
  String: ResolverTypeWrapper<Scalars['String']['output']>;
  User: ResolverTypeWrapper<User>;
  VisibleAreaPlaces: ResolverTypeWrapper<VisibleAreaPlaces>;
}>;

/** Mapping between all available schema types and the resolvers parents */
export type ResolversParentTypes = ResolversObject<{
  Boolean: Scalars['Boolean']['output'];
  Bounds: Bounds;
  Float: Scalars['Float']['output'];
  ID: Scalars['ID']['output'];
  Place: Place;
  PlaceDetails: PlaceDetails;
  Query: {};
  String: Scalars['String']['output'];
  User: User;
  VisibleAreaPlaces: VisibleAreaPlaces;
}>;

export type PlaceResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Place'] = ResolversParentTypes['Place']> = ResolversObject<{
  address?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  createdAt?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  creatorUserId?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  id?: Resolver<ResolversTypes['ID'], ParentType, ContextType>;
  lat?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  lng?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  name?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type PlaceDetailsResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['PlaceDetails'] = ResolversParentTypes['PlaceDetails']> = ResolversObject<{
  averageRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  creatorUsername?: Resolver<ResolversTypes['String'], ParentType, ContextType>;
  place?: Resolver<ResolversTypes['Place'], ParentType, ContextType>;
  userRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type QueryResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['Query'] = ResolversParentTypes['Query']> = ResolversObject<{
  placeDetails?: Resolver<Maybe<ResolversTypes['PlaceDetails']>, ParentType, ContextType, RequireFields<QueryPlaceDetailsArgs, 'id'>>;
  userDetails?: Resolver<Maybe<ResolversTypes['User']>, ParentType, ContextType, Partial<QueryUserDetailsArgs>>;
  visibleAreaPlaces?: Resolver<Array<Maybe<ResolversTypes['VisibleAreaPlaces']>>, ParentType, ContextType, RequireFields<QueryVisibleAreaPlacesArgs, 'bounds'>>;
}>;

export type UserResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['User'] = ResolversParentTypes['User']> = ResolversObject<{
  email?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  memberSince?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  username?: Resolver<Maybe<ResolversTypes['String']>, ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type VisibleAreaPlacesResolvers<ContextType = GraphQLContext, ParentType extends ResolversParentTypes['VisibleAreaPlaces'] = ResolversParentTypes['VisibleAreaPlaces']> = ResolversObject<{
  averageRating?: Resolver<ResolversTypes['Float'], ParentType, ContextType>;
  place?: Resolver<ResolversTypes['Place'], ParentType, ContextType>;
  __isTypeOf?: IsTypeOfResolverFn<ParentType, ContextType>;
}>;

export type Resolvers<ContextType = GraphQLContext> = ResolversObject<{
  Place?: PlaceResolvers<ContextType>;
  PlaceDetails?: PlaceDetailsResolvers<ContextType>;
  Query?: QueryResolvers<ContextType>;
  User?: UserResolvers<ContextType>;
  VisibleAreaPlaces?: VisibleAreaPlacesResolvers<ContextType>;
}>;

