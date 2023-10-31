import React from 'react'
import { supabaseServer } from '@utils/supabaseServer'
import MyProjectInfo from '@/app/dashboard/MyProjectInfo'
import { Video } from '@/types/data'

export const dynamic = 'force-dynamic'

const Dashboard = async () => {
	const supabase = supabaseServer()

	const {
		data: { user },
	} = await supabase.auth.getUser()
	const data = (await supabase.from('recordings').select('*').eq('author', user!.id)).data
	if (!data) return <MyProjectInfo projects={[]} />
	const res : Video[] = []
	for (const i of data) {
		const title = (await supabase.from('videos').select('*').eq('id', i.video).single()).data!.title
		res.push({
			caption: null,
			created_at: i.created_at,
			id: i.video,
			title: title
		})
	}
	return <MyProjectInfo projects={res as unknown as Video[]} />
}

export default Dashboard
