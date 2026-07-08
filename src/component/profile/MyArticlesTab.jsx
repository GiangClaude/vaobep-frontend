import { useState, useMemo } from 'react';
import { Plus } from 'lucide-react';
import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';

import ArticleEditorModal from '../article/ArticleEditorModal';
import ArticleCard from '../common/ArticleCard';
import { useGlobalModal } from '../../context/ModalContext'; 

import { useOwnerArticlesQuery } from '../../hooks/queries/useArticlesQueries';
import { useDeleteArticleMutation, useChangeArticleStatusMutation } from '../../hooks/mutations/useContentMutations';

export function MyArticlesTab({ isPublicView = false, publicArticles = [] }) {
  const navigate = useNavigate();
  const { showModal } = useGlobalModal();

  const [filter, setFilter] = useState('all');
  const [editorOpen, setEditorOpen] = useState(false);
  const [editorInitial, setEditorInitial] = useState(null);

  const { data: ownerArticles = [], isLoading } = useOwnerArticlesQuery();

  const deleteMutation = useDeleteArticleMutation();
  const statusMutation = useChangeArticleStatusMutation();

  const displayArticles = useMemo(() => {
    let result = isPublicView ? publicArticles : ownerArticles;

    if (isPublicView) {
        result = result.filter(a => a.status === 'public');
    } else if (filter !== 'all') {
        result = result.filter(a => (a.status || 'public') === filter);
    }
    return result;
  }, [isPublicView, publicArticles, ownerArticles, filter]);

  const goToArticle = (id) => navigate(`/article/${id}`);

  const openCreate = () => {
    setEditorInitial(null);
    setEditorOpen(true);
  };

  const openEdit = (id) => {
    const art = ownerArticles.find(a => (a.id || a.article_id) === id);
    if (!art) return;
    
    const initial = {
      id: art.id || art.article_id,
      title: art.title,
      excerpt: art.excerpt || art.description,
      content: art.content || art.rawContent || art.html || '',
      image: art.image,
      status: art.status,
      readTime: art.readTime || art.read_time,
      tags: art.rawTags || art.tags || [],
      recipes: art.linkedRecipes || art.recipes || []
    };
    setEditorInitial(initial);
    setEditorOpen(true);
  };

  const handleConfirmDelete = (id) => {
    showModal({
      title: 'Xác nhận xóa',
      message: 'Bạn chắc chắn muốn xóa bài viết này? Hành động không thể hoàn tác.',
      type: 'warning',
      actions: [
        { label: 'Hủy', style: 'secondary' },
        { 
          label: 'Xóa', 
          style: 'danger', 
          onClick: () => {
            deleteMutation.mutate(id, {
              onSuccess: () => showModal({ title: "Thành công", message: "Đã xóa bài viết!", type: "success" })
            });
          }
        }
      ]
    });
  };

  const handleToggleVisibility = (article) => {
    const newStatus = article.status === 'hidden' ? 'public' : 'hidden';
    statusMutation.mutate({ articleId: article.id || article.article_id, status: newStatus });
  };

  const onEditorSaved = () => {
    setEditorOpen(false);
  };

  return (
    <div>
      <ArticleEditorModal 
        isOpen={editorOpen} 
        onClose={() => setEditorOpen(false)} 
        initialData={editorInitial} 
        onSaved={onEditorSaved} 
      />
      
      <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
        <div className="flex gap-2">
          {!isPublicView && ['all','public', 'draft', 'banned'].map(f => (
            <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-sm transition-all ${filter === f ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white' : 'bg-white text-gray-700 hover:bg-gray-100'}`}>
              {f === 'all' && 'Tất cả'}
              {f === 'public' && 'Công khai'}
              {f === 'draft' && 'Nháp'}
              {f === 'banned' && 'Bị ban'}
            </button>
          ))}
        </div>

        {!isPublicView && (
          <div className="flex items-center gap-3 ml-auto">
            <motion.button onClick={openCreate} whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="bg-gradient-to-r from-[#ff6b35] to-[#f7931e] text-white px-5 py-2 rounded-full flex items-center gap-2 shadow-md font-semibold text-sm">
              <Plus className="w-4 h-4" /> Tạo bài viết
            </motion.button>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="text-center py-20 text-[#7d5a3f] animate-pulse">Đang tải bài viết của bạn...</div>
      ) : displayArticles.length === 0 ? (
        <div className="text-center py-20 text-[#7d5a3f]">Chưa có bài viết phù hợp.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {displayArticles.map(a => (
            <ArticleCard
              key={a.id}
              id={a.id}
              author={a.author}
              authorAvatar={a.authorAvatar}
              date={a.date}
              readTime={a.readTime}
              title={a.title}
              excerpt={a.excerpt}
              tags={a.tags || []}
              image={a.image}
              commentCount={a.commentCount}
              status={a.status}
              isOwnerView={!isPublicView}
              isLiked={a.isLiked}
              isSaved={a.isSaved}
              likeCount={a.likeCount}
              onClick={() => goToArticle(a.id)}
              onEdit={(id) => openEdit(id)}
              onDelete={(id) => handleConfirmDelete(id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}