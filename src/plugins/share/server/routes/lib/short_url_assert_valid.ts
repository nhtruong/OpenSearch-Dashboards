/*
 * SPDX-License-Identifier: Apache-2.0
 *
 * The OpenSearch Contributors require contributions made to
 * this file be licensed under the Apache-2.0 license or a
 * compatible open source license.
 *
 * Any modifications Copyright OpenSearch Contributors. See
 * GitHub history for details.
 */

/*
 * Licensed to Elasticsearch B.V. under one or more contributor
 * license agreements. See the NOTICE file distributed with
 * this work for additional information regarding copyright
 * ownership. Elasticsearch B.V. licenses this file to you under
 * the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */

import { parse } from 'url';
import { trim } from 'lodash';
import Boom from '@hapi/boom';
import { WORKSPACE_PATH_PREFIX } from '../../../../../core/server';

export function shortUrlAssertValid(url: string) {
  const { protocol, hostname, pathname } = parse(
    url,
    false /* parseQueryString */,
    true /* slashesDenoteHost */
  );

  if (protocol !== null) {
    throw Boom.notAcceptable(`Short url targets cannot have a protocol, found "${protocol}"`);
  }

  if (hostname !== null) {
    throw Boom.notAcceptable(`Short url targets cannot have a hostname, found "${hostname}"`);
  }

  let pathnameParts = trim(pathname === null ? undefined : pathname, '/').split('/');

  // Workspace introduced paths like `/w/${workspaceId}/app`
  // ignore the first 2 elements if it starts with /w
  if (`/${pathnameParts[0]}` === WORKSPACE_PATH_PREFIX) {
    pathnameParts = pathnameParts.slice(2);
  }
  if (pathnameParts[0] !== 'app' || !pathnameParts[1]) {
    throw Boom.notAcceptable(
      `Short url target path must be in the format "/app/{{appId}}", found "${pathname}"`
    );
  }
}
