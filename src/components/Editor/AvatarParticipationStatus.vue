<!--
  - SPDX-FileCopyrightText: 2019 Nextcloud GmbH and Nextcloud contributors
  - SPDX-License-Identifier: AGPL-3.0-or-later
-->

<template>
	<div class="avatar-participation-status">
		<Avatar v-if="isGroup">
			<template #icon>
				<AccountMultiple :size="28" />
			</template>
		</Avatar>
		<Avatar v-else
			:disable-tooltip="true"
			:user="commonName"
			:display-name="commonName"
			:is-no-user="true" />
		<template v-if="!isGroup">
			<template v-if="participationStatus === 'ACCEPTED' && isViewedByOrganizer">
				<IconCheck class="avatar-participation-status__indicator"
					fill-color="#32CD32"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Invitation accepted') }}
				</div>
			</template>
			<template v-else-if="isResource && participationStatus === 'ACCEPTED'">
				<IconCheck class="avatar-participation-status__indicator"
					fill-color="#32CD32"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Available') }}
				</div>
			</template>
			<template v-else-if="isSuggestion">
				<IconCheck class="avatar-participation-status__indicator"
					fill-color="#32CD32"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Suggested') }}
				</div>
			</template>
			<template v-else-if="participationStatus === 'TENTATIVE'">
				<IconCheck class="avatar-participation-status__indicator"
					fill-color="#32CD32"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Participation marked as tentative') }}
				</div>
			</template>
			<template v-else-if="participationStatus === 'ACCEPTED' && !isViewedByOrganizer">
				<IconCheck class="avatar-participation-status__indicator"
					fill-color="#32CD32"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Accepted {organizerName}\'s invitation', {
						organizerName: organizerDisplayName,
					}) }}
				</div>
			</template>
			<template v-else-if="isResource && participationStatus === 'DECLINED'">
				<IconClose class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Not available') }}
				</div>
			</template>
			<template v-else-if="participationStatus === 'DECLINED' && isViewedByOrganizer">
				<IconClose class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Invitation declined') }}
				</div>
			</template>
			<template v-else-if="participationStatus === 'DECLINED' && !isViewedByOrganizer">
				<IconClose class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Declined {organizerName}\'s invitation', {
						organizerName: organizerDisplayName,
					}) }}
				</div>
			</template>
			<template v-else-if="participationStatus === 'DELEGATED'">
				<IconDelegated class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Invitation is delegated') }}
				</div>
			</template>
			<template v-else-if="isResource">
				<IconNoResponse class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Checking availability') }}
				</div>
			</template>
			<template v-else-if="isViewedByOrganizer">
				<IconNoResponse class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Awaiting response') }}
				</div>
			</template>
			<template v-else>
				<IconNoResponse class="avatar-participation-status__indicator"
					:size="20" />
				<div class="avatar-participation-status__text">
					{{ t('calendar', 'Has not responded to {organizerName}\'s invitation yet', {
						organizerName: organizerDisplayName,
					}) }}
				</div>
			</template>
		</template>
	</div>
</template>

<script>
import { NcAvatar as Avatar } from '@nextcloud/vue'
import AccountMultiple from 'vue-material-design-icons/AccountMultiple.vue'
import IconCheck from 'vue-material-design-icons/CheckCircle.vue'
import IconNoResponse from 'vue-material-design-icons/HelpCircle.vue'
import IconClose from 'vue-material-design-icons/CloseCircle.vue'
import IconDelegated from 'vue-material-design-icons/ArrowRightDropCircle.vue'

export default {
	name: 'AvatarParticipationStatus',
	components: {
	  Avatar,
	  AccountMultiple,
	  IconCheck,
	  IconNoResponse,
	  IconClose,
	  IconDelegated,

	},
	props: {
		avatarLink: {
			type: String,
			required: true,
		},
		participationStatus: {
			type: String,
			required: true,
		},
		commonName: {
			type: String,
			required: true,
		},
		isViewedByOrganizer: {
			type: Boolean,
			required: true,
		},
		isResource: {
			type: Boolean,
			required: true,
		},
		isGroup: {
			type: Boolean,
			required: false,
		},
		isSuggestion: {
			type: Boolean,
			default: false,
		},
		attendeeIsOrganizer: {
			type: Boolean,
			required: true,
		},
		organizerDisplayName: {
			type: String,
			required: true,
		},
	},
}
</script>
<style lang="scss" scoped>
:deep(.avatar-participation-status__indicator) {
	bottom: 20px;
	left: 43px;
	position: relative;
	opacity: .8;
}

.avatar-participation-status__text {
	opacity: .45;
	left: 63px;
	bottom: 21px;
	white-space: nowrap;
	position: relative;
	min-width: 220px;
	text-overflow: ellipsis;
	overflow: hidden;
}
</style>
