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

package com.google.sps;

import com.google.sps.data.ShoppingListTextEntry;
import java.util.ArrayList;
import java.util.List;

/**
 * This is a fake implementation class used in the unit tests to avoid triggering cloudVisionAPI
 * calls. The test's setup should provide either of the two values
 * 1) Set the exception status
 * 2) Set the data value with expected response to be returned back.
 */
public class FakeTextDetectionAPIImpl implements TextDetectionAPI {
  private List<ShoppingListTextEntry> detectedData;
  private PhotoDetectionException photoDetectionException;

  public FakeTextDetectionAPIImpl() {
    // Initialize detectedData to a default value
    detectedData = new ArrayList<>();
    this.detectedData.add(ShoppingListTextEntry.create("Bag", 10, 13));
  }

  /**
   * Set expected response in detectedData variable to be returned. Called from the test's setup,
   * passing the expected response as parameter
   */
  public void setReturnValue(List<ShoppingListTextEntry> detectedData) {
    this.detectedData = detectedData;
  }

  /**
   * Set exception to be thrown. Called from the test's setup, passing the expected
   * photoDetectionException as parameter
   */
  public void setException(PhotoDetectionException photoDetectionException) {
    this.photoDetectionException = photoDetectionException;
  }

  public List<ShoppingListTextEntry> detect(byte[] imageBytes) throws PhotoDetectionException {
    if (photoDetectionException != null) {
      throw this.photoDetectionException;
    }
    return this.detectedData;
  }
}
