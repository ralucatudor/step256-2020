// Copyright 2019 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package com.google.sps.data;

/**
 * Class containing input for querying Google Shopping.
 * Follows the Builder Pattern.
 */
public final class ShoppingQueryInput {
  private final String shoppingQuery;
  private final String language;
  private final Integer maxResultsNumber;

  public static class Builder {
    // Required parameters
    private final String shoppingQuery;
    
    // Optional parameters - initialized to default values
    private String language = "en";
    private Integer maxResultsNumber = 50;

    public Builder(String shoppingQuery) {
      this.shoppingQuery = shoppingQuery;
    }

    public Builder language(String language) {
      this.language = language;
      return this;
    }

    public Builder maxResultsNumber(Integer maxResultsNumber) {
      this.maxResultsNumber = maxResultsNumber;
      return this;
    }

    public ShoppingQueryInput build() {
      return new ShoppingQueryInput(this);
    }
  }

  private ShoppingQueryInput(Builder builder) {
    shoppingQuery = builder.shoppingQuery;
    language = builder.language;
    maxResultsNumber = builder.maxResultsNumber;
  }

  public String getShoppingQuery() {
    return shoppingQuery;
  }

  public String getLanguage() {
    return language;
  }

  public Integer getMaxResultsNumber() {
    return maxResultsNumber;
  }
}
