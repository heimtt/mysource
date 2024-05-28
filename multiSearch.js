$(function(){
	const $leftMenu = $('#left-menu'),
	$leftMenuContainer = $leftMenu.find('#left-menu-container'),
	$header = $('#header'), 
	$main = $('#main'),
	pcNaviMenu = $header.find('#header-menu .my-navi').html();


	//絞り込みメニュー
		//PCのグローバルメニュータグリストを生成する
		let tagsList = {};

			//国内・海外のリストを取得
			$header.find('.region-item').each(function(){
				const $thisMap = $(this),
					map = $(this).attr('class').split('region-item region_')[1];
				let	areaList = [];

				$thisMap.find('.area-items').children('a').each(function(){
					const $thisArea = $(this),
						valueHref = $thisArea.attr('href').split('/')[1],
						valueTag = $thisArea.attr('data-tag');
					areaList += `<li><input type="checkbox" id="area-${valueHref}" class="area-tag"><label for="area-${valueHref}"><span>${valueTag}</span></label></li>`;
				});
				tagsList[map] = areaList;
			});

			//気分のリストの取得
			let stlyeList = [];
			$header.find('.style-search').find('.style-items').find('a').each(function(){
				const valueTag = $(this).attr('data-tag');
				stlyeList += `<li><input type="checkbox" id="style-${valueTag}" class="style-tag"><label for="style-${valueTag}"><span>${valueTag}</span></label></li>`;
			});
			tagsList['style'] = stlyeList;

			//ソースコードを生成する
			const tagsTitle = {dom:'国内', intl:'海外', style:'気分'}, //タグのカテゴリを指定
				tagsTitleLen = Object.keys(tagsTitle).length;
			let searchMenuTagsBody = [];
			for(let i=0; i<tagsTitleLen; i++) {
				const tagsTitleValue =  Object.values(tagsTitle)[i],
					tagsTitleKey =  Object.keys(tagsTitle)[i];
				searchMenuTagsBody += `<div class="tags-title">${tagsTitleValue}</div><ul class="tags-list">${tagsList[tagsTitleKey]}</ul>`
			}
			$('#search-menu .search-menu-tags .search-type-body').append(searchMenuTagsBody);

		//絞り込みメニューの挙動設定
		$('#search-menu').insertAfter($leftMenuContainer);
		const $searchTags = $('.search-menu-tags input'), 
			$searchForm = $('.widget-search-form input'), 
			$searchTagsBtn = $('#search-tags-btn');
		
		let	$selectedTags, 
			$notSelectedTags;

			//タグ選択を無効にする関数
			function tagsUnableSwitch (obj,value){
				obj.each(function(){
					$(this).next('label').toggleClass('unable', value);
				});
			}

			// フリーワード検索の入力をチェック
			$searchForm.on('input', function(){
				const inputText = $(this).val();
				if(inputText) { // 入力されている場合、タグ検索を無効に
					tagsUnableSwitch($searchTags, true);
				} else {
					tagsUnableSwitch($searchTags, false);
				} 
			});

			//選択されているタグをチェック
			$searchTags.on('change', function(){
				$selectedTags = $searchTags.filter(':checked');
				$notSelectedTags = $searchTags.not(':checked');

				if ($selectedTags.length >= 1) { // 選択されているタグが1個以上の場合
					$searchForm.parent().toggleClass('unable', true);  // フリーワード検索を無効に
					$searchTagsBtn.toggleClass('unable', false); // タグ検索ボタンを有効に

					if ($selectedTags.length >= 2) { // 選択できるタグ数を3個までに
						tagsUnableSwitch($notSelectedTags, true);
					} else {
						const $selectedAreaTags = $selectedTags.filter('.area-tag'),
						$selectedStyleTags = $selectedTags.filter('.style-tag'),
						$notSelectedAreaTags = $notSelectedTags.filter('.area-tag'),
						$notSelectedStyleTags = $notSelectedTags.filter('.style-tag');
						if ($selectedAreaTags[0]) {
							tagsUnableSwitch($notSelectedAreaTags, true);
							tagsUnableSwitch($notSelectedStyleTags, false);
						} else if ($selectedStyleTags[0]) {
							tagsUnableSwitch($notSelectedAreaTags, false);
							tagsUnableSwitch($notSelectedStyleTags, true);
						} 
						//else {
							//tagsUnableSwitch($notSelectedTags, false);
						//}
					}

				} else { // 選択されているタグが1個未満の場合
					tagsUnableSwitch($notSelectedTags, false);
					$searchForm.parent().toggleClass('unable', false); // フリーワード検索を有効に
					$searchTagsBtn.toggleClass('unable', true); // タグ検索ボタンを無効に
				}
			});

			//タグ検索ボタンの遷移先を設定
			$searchTagsBtn.on('click touchstart', function(){
				let joinedTags ='';
				for(let i = 0; i <$selectedTags.length; i++) {
					if(i<1) {
						joinedTags += $selectedTags.eq(i).next('label').text();
					} else {
						joinedTags+= ',' + $selectedTags.eq(i).next('label').text();
					}
				}
				location.href = '/_tags/' + joinedTags;
			});


		//SP時のグローバルメニュー作成
		const spNaviMenu = pcNaviMenu.replaceAll(/checkbox-/g, 'checkbox-sp'),
		mySearchBtn = $('#my-search-btn').html();
		$leftMenuContainer.after(`<div class="sp-navi-menu" class="for-mobile"><ul class="my-navi">${spNaviMenu}</ul><a id="my-search-btn-clone" class="search-btn" href="#">${mySearchBtn}</a></div>`);


		//ハンバーガーメニュー・絞り込みメニューのボタンの挙動設定
		$('#my-search-btn, #my-search-btn-clone, #search-menu-close > span').on('click touchstart', function(ev) {
			ev.preventDefault();
			setTimeout(toggleSubMenu);
		});

		function toggleSubMenu(force) {
			$leftMenu.toggleClass('sub-menu', force);
			$header.toggleClass('sub-menu', force);
			$main.toggleClass('sub-menu', force);
			$leftMenu.toggleClass('opened', false);
			$header.toggleClass('slide-right', false);
			$main.toggleClass('left-menu-opened', false);
		}

		$('#menu-icon').on('click touchstart', function(ev) {
			$leftMenu.toggleClass('sub-menu', false);
			$header.toggleClass('sub-menu', false);
			$main.toggleClass('sub-menu', false);
		});

		$(document).on('scrollstart',function(){
			if(!$leftMenu.is('.sub-menu')&&$header.is('.sub-menu')) {
				$header.removeClass('slide-up');
			}
		});

});