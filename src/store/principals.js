/**
 * SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
 * SPDX-License-Identifier: AGPL-3.0-or-later
 */
import {
	findPrincipalByUrl,
	getCurrentUserPrincipal,
} from '../services/caldavService.js'
import logger from '../utils/logger.js'
import {
	getDefaultPrincipalObject,
	mapDavToPrincipal,
} from '../models/principal.js'
import { defineStore } from 'pinia'
import Vue from 'vue'

export default defineStore('principals', {
	state: () => {
		return {
			principals: [],
			principalsById: {},
			currentUserPrincipal: null,
		}
	},
	getters: {
		/**
		 * Gets a principal object by its url
		 *
		 * @param {object} state the store data
		 * @return {function({String}): {Object}}
		 */
		getPrincipalByUrl: (state) => (url) => state.principals.find((principal) => principal.url === url),

		/**
		 * Gets a principal object by its id
		 *
		 * @param {object} state the store data
		 * @return {function({String}): {Object}}
		 */
		getPrincipalById: (state) => (id) => state.principalsById[id],

		/**
		 * Gets the principal object of the current-user-principal
		 *
		 * @param {object} state the store data
		 * @return {{Object}}
		 */
		getCurrentUserPrincipal: (state) => state.principalsById[state.currentUserPrincipal],

		/**
		 * Gets the email-address of the current-user-principal
		 *
		 * @param {object} state the store data
		 * @return {string|undefined}
		 */
		getCurrentUserPrincipalEmail: (state) => state.principalsById[state.currentUserPrincipal]?.emailAddress,
	},
	actions: {
		/**
		 * Fetches a principal from the DAV server and commits it to the state
		 *
		 * @param {string} url The URL of the principal
		 * @return {Promise<void>}
		 */
		async fetchPrincipalByUrl({ url }) {
			// Don't refetch principals we already have
			if (this.getPrincipalByUrl(url)) {
				return
			}

			const principal = await findPrincipalByUrl(url)
			if (!principal) {
				// TODO - handle error
				return
			}

			this.addPrincipalMutation({ principal: mapDavToPrincipal(principal) })

		},

		/**
		 * Fetches the current-user-principal
		 *
		 * @return {Promise<void>}
		 */
		async fetchCurrentUserPrincipal() {
			const currentUserPrincipal = getCurrentUserPrincipal()
			if (!currentUserPrincipal) {
				// TODO - handle error
				return
			}

			const principal = mapDavToPrincipal(currentUserPrincipal)
			this.addPrincipalMutation({ principal })
			this.currentUserPrincipal = principal.id
			logger.debug(`Current user principal is ${principal.url}`)
		},

		/**
		 * Adds a principal to the state
		 *
		 * @param {object} data The destructuring object
		 * @param {object} data.principal The principal to add
		 */
		addPrincipalMutation({ principal }) {
			const object = getDefaultPrincipalObject(principal)

			if (this.principalsById[object.id]) {
				return
			}

			this.principals.push(object)
			/// TODO this.principalsById[object.id] = object
			Vue.set(this.principalsById, object.id, object)
		},

		/**
		 * Changes the schedule-default-calendar-URL of a principal
		 *
		 * @param {object} data The destructuring object
		 * @param {object} data.principal The principal to modify
		 * @param {string} data.scheduleDefaultCalendarUrl The new schedule-default-calendar-URL
		 * @return {Promise<void>}
		 */
		async changePrincipalScheduleDefaultCalendarUrl({ principal, scheduleDefaultCalendarUrl }) {
			principal.dav.scheduleDefaultCalendarUrl = scheduleDefaultCalendarUrl

			await principal.dav.update()
			Vue.set(
				this.principalsById[principal.id],
				'scheduleDefaultCalendarUrl',
				scheduleDefaultCalendarUrl,
			)
		},
	},
})
